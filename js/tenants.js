/**
 * MS Edge doesn't support the promise-based APIs (`chrome.*`), so use the callback
 * based APIs (`browser.*`).  *Chrome* blows up if you use `browser`, so use `this.browser` instead
 *
 * @returns {Object}
 */
function chromeOrBrowser() {
    return this.browser || chrome;
}

var storage = chromeOrBrowser().storage.sync;

if (!storage) {
    storage = chromeOrBrowser().storage.local;
}
/**
 * @callback activeTenant
 *
 * @param {object} tenant - Currently active tenant
 */
/**
 * Returns the saved 'active' tenant from browser storage
 *
 * @param {activeTenant} cb
 */
function getActiveTenant(cb) {
    storage.get({
        activeTenant: null
    }, function(tenants, err) {
        if (chromeOrBrowser().runtime.lastError || typeof tenants === 'undefined' || !tenants.activeTenant) {
            chromeOrBrowser().storage.local.get({
                activeTenant: null
            }, function(tenants) {
                if (tenants.activeTenant) {
                    storage = chromeOrBrowser().storage.local;
                }

                convertActiveTenantToObject(tenants.activeTenant, function(updatedTenant){
                  return cb(updatedTenant);
                });
            });
        } else {
            convertActiveTenantToObject(tenants.activeTenant, function(updatedTenant){
              return cb(updatedTenant);
            });
        }
    });
}

/**
 * Checks to see if the active tenant is stored as a simple
 * string, if so converts to an object and overwrites the
 * value currently stored in browser storage.
 *
 * @param {object}     tenant
 * @param {function()} cb - Callback to run once updated
 */
function convertActiveTenantToObject(activeTenant, cb) {
  if (!activeTenant) {
    // if the activeTenant is null or undefined then
    // simply return null, and let the extension
    // force the user to the options pane
    return cb(null);
  }

  if (activeTenant.region) {
    // if the activeTenant has a region property
    // then, its an object just continue.
    return cb(activeTenant);
  } else {
    // if the active tenant doesn't have a region property
    // then it's going to be a simple string. Retrieve the
    // complete tenants list and find the tenant object, then
    // overwrite active tenant in local storage with the object
    // and return it.
    getTenants(function(updatedTenantsList) {
      var updatedTenant = updatedTenantsList[activeTenant];
      if (updatedTenant) {
        saveActiveTenant(updatedTenant, function() {
          return cb(updatedTenant);
        });
      } else {
        // return null which will
        // force the user to the options pane
        return cb(null);
      }
    });
  }
}

/**
 * Stores the preferred tenant in browser storage
 *
 * @param {object}     tenant
 * @param {function()} cb - Callback to run once stored
 */
function saveActiveTenant(tenant, cb) {
    storage.set({
        activeTenant: tenant
    }, function() {
        if (chromeOrBrowser().runtime.lastError) {
            storage = chromeOrBrowser().storage.local;
            return saveActiveTenant(tenant, cb);
        } else {
            getActiveTenant(function(t) {
                if (typeof t === 'undefined') {
                    storage = chromeOrBrowser().storage.local;
                    return saveActiveTenant(tenant, cb);
                } else {
                    cb();
                }
            });

        }
    });
}

/**
 *
 * @callback allTenants
 *
 * @param {Object} tenants An object of tenants, keyed by tenant code, with the name as values
 */
/**
 * Returns all defined tenants
 *
 * @param {allTenants} cb
 */
function getTenants(cb) {
    var tenants = {};
    getTenantList(function(tenantList) {
        for (var code in tenantList) {
            var tenant = tenantList[code];
            tenant.code = code;

            if (tenant.hasOwnProperty('apps') && tenant.apps.hasOwnProperty('rl')) {
                tenants[code] = tenant;
            }
        }
        cb(tenants);
    });
}

/**
 * Retrieves the current tenant list or displays a canned list, if error
 * @param {*} cb
 */
function getTenantList(cb) {
    var headers = new Headers({'Content-Type': 'application/json'});
    fetch('https://talis-public.talis.com/talis.com/customers.json', {headers: headers})
    .then(function (response) {
        return response.json();
    })
    .catch(function (e) {
        return allTenants;
    })
    .then(function (tenants) {
        cb(tenants);
    });
}
