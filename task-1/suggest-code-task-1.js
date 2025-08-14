// Notification Utility
// In the feature, we can replace this with other notification libraries or custom implementations without changing the rest of the code.
function notifySuccess(message) {
  abp.notify.success(message);
}

function notifyError(message) {
  abp.notify.error(message);
}

function notifyInfo(message) {
  abp.notify.info(message);
}

// Validation Utility
function validateImportInput(
  allImportData,
  normalApiName,
  modal,
  tableName
) {
  const errors = [];
  if (!Array.isArray(allImportData)) {
    errors.push('Invalid input: allImportData must be an array.');
  }
  if (allImportData.length === 0) {
    errors.push('Invalid input: allImportData cannot be empty.');
  }
  if (typeof normalApiName !== 'string' || normalApiName.trim() === '') {
    errors.push('Invalid input: normalApiName must be a non-empty string.');
  }
  if (typeof modal !== 'string' || modal.trim() === '') {
    errors.push('Invalid input: modal must be a non-empty string.');
  }
  if (typeof tableName !== 'string' || tableName.trim() === '') {
    errors.push('Invalid input: tableName must be a non-empty string.');
  }
  return errors;
}

var BATCH_SIZE = 100;
var SEND_TIMEOUT = 30000;
var MAX_RETRIES = 3;
var DELAY_TIME = 1000;
var MAX_CONCURRENT_REQUESTS = 5;

async function importCsvData(
  csvData,
  apiEndpoint,
  modalSelector,
  dataTableSelector,
  options = { }
) {
  const validationErrors = validateImportInput(csvData, apiEndpoint, modalSelector, dataTableSelector);
  if (validationErrors.length > 0) {
    notifyError('Import failed: ' + validationErrors.join('\n'));
    return;
  }

  const config = {
    batchSize: options.batchSize || BATCH_SIZE, 
    sendTimeout: options.sendTimeout || SEND_TIMEOUT,
    maxRetries: options.maxRetries || MAX_RETRIES,
    delayTime: options.delayTime || DELAY_TIME,
    maxConcurrentRequests: options.maxConcurrentRequests || MAX_CONCURRENT_REQUESTS
  }
  
  $(modal).modal("show");

  try {
    
    const batches = createBatchData(csvData, config.batchSize);

    const batchPromises = batches.map((batch, index) =>
      submitBatchWithRetries(batch, apiEndpoint, config)
    );

    const result = await processBatchesWithProgress(
      batchPromises,
      config.maxConcurrentRequests
    );
    handleImportSuccess(dataTableSelector);
    return true;
  } catch (error) {
    handleImportError(error);
    return false;
  } finally {
    $(modal).modal("hide");
  }
}

function createBatchData(data, batchSize) {
  const batches = [];
  const totalRecords = data.length;
  const processRecords = 0;
  for (let i = 0; i < totalRecords; i += batchSize) {
    const batch = data.slice(i, i + batchSize).map(item => structuredClone(item));
    processRecords += batchSize;
    importRowDataShow(totalRecords, processRecords);
    batches.push(batch);
  }
  return batches;
}

function submitBatch(batch, apiEndpoint, timeout) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: apiEndpoint,
      type: 'POST',
      data: JSON.stringify(batch),
      contentType: 'application/json',
      timeout: timeout,
      success: function (response) {  
        if (response && response.success) {
          resolve(response);
        } else {
          const errorMessage = response?.error || 'Unknown server error';
          reject(new Error(`Server returned error: ${errorMessage}`));
        }
      },
      error: function (xhr, status, error) {
        reject(error);
      },
    });
  });
}

function submitBatchWithRetries(batch, apiEndpoint, config, batchIndex) {
  let attempts = 0;

  const attemptSubmit = () => {
    return submitBatch(batch, apiEndpoint, config.sendTimeout)
      .catch(error => {
        if (attempts < config.maxRetries) {
          attempts++;
          return new Promise(resolve => setTimeout(resolve, config.delayTime))
            .then(attemptSubmit);
        } else {
          console.error(`Batch ${batchIndex} failed after ${attempts} attempts:`, error);
          notifyError(`Batch ${batchIndex} import failed after ${attempts} attempts: ${error.message}`);
          throw error;
        }
      });
  };

  return attemptSubmit();
}

function handleImportSuccess(tableSelector) {
  try {
    $(tableSelector).DataTable().ajax.reload();
    notifySuccess('Import completed successfully');
  } catch (uiError) {
    console.warn('UI update failed after successful import:', uiError);
    notifyInfo('Import completed successfully (UI refresh failed)');
  }
}
function handleImportError(error) {
  console.error('Import error:', error);
  notifyError(error.message || 'Import failed with unknown error');
}

async function processBatchesWithProgress(
  batches,
  maxConcurrentRequests
) {
  const result = [];
  for (let i = 0; i < batches.length; i++) {
    const currentBatch = batches.slice(i, i + maxConcurrentRequests);
    const batchResults = await Promise.allSettled(
      ...currentBatch
    );
    result.push(...batchResults);
  }
  return result;
}