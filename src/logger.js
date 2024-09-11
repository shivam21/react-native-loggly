var LOGGLY_COLLECTOR_DOMAIN = 'logs-01.loggly.com',
  LOGGLY_PROXY_DOMAIN = 'loggly';

// Utility function to generate a UUID
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// LogglyTracker class definition
class LogglyTracker {
  constructor() {
    this.key = null;
    this.tag = 'DehaatLogger';
    this.useDomainProxy = false;
    this.useUtfEncoding = true;
    this.session_id = this.initSession(); // Set the session_id in-memory
    this.user_id = null; // Initialize user_id as null
    this.commonProperties = new Map()
  }

  initSession() {
    // Create and return a new session ID in memory
    return uuid();
  }

  setKey(key) {
    this.key = key;
    this.setInputUrl();
  }

  setTag(tag) {
    this.tag = tag;
  }

  setAppInfo(versionCode, versionName, buildType) {
    this.versionCode = versionCode;
    this.versionName = versionName;
    this.buildType = buildType;
  }

  setDeviceInfo(deviceId, googleId) {
    this.deviceId = deviceId;
    this.googleId = googleId;
  }

  setAppCode(appCode) {
    this.appCode = appCode;
  }

  setMixPanelId(mixPanelId) {
    this.mixPanelId = mixPanelId;
  }

  setDomainProxy(useDomainProxy) {
    this.useDomainProxy = useDomainProxy;
    this.setInputUrl();
  }

  setUtfEncoding(useUtfEncoding) {
    this.useUtfEncoding = useUtfEncoding;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  addCommonProperty(key, value) {
    this.commonProperties.set(key, value);
  }

  setInputUrl() {
    const protocol = 'https';
    const logglyDomain = this.useDomainProxy
      ? `/${LOGGLY_PROXY_DOMAIN}/inputs/`
      : `/${LOGGLY_COLLECTOR_DOMAIN}/inputs/`;
    this.inputUrl = `${protocol}://${logglyDomain}${this.key}/tag/${this.tag}`;
  }

  // Renamed method to avoid conflict
  async logData(data) {
    this.log(this.tag, data);
  }

  async log(tag, logData, level = "debug") {
    if (!this.key) {
      console.error('Please set Loggly key');
      return;
    }
    let data = this.updateLogData(logData);
    this.updateSessionId(data);
    this.updateUserId(data);
    this.updateTag(data, tag);
    this.updateLevel(data, level);
    this.updateDeviceProperties(data);
    this.updateAppCode(data);
    this.updateAppInfo(data);
    this.updateMixPanelProperties(data);
    this.updateCommonProperties(data)
    this.pushDataToServer(data);
  }

  async pushDataToServer(data) {
    try {
      await fetch(this.inputUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': this.useUtfEncoding ? 'text/plain; charset=utf-8' : 'text/plain',
        },
        body: JSON.stringify(data),
      });
    } catch (ex) {
      console.error('Failed to log to Loggly:', ex, 'Log data:', data);
    }
  }

  updateLogData(logData) {
    let data = {};
    if (typeof logData === 'string') {
      data = { text: logData };
    } else if (Array.isArray(logData)) { // Corrected type check for arrays
      data = { aList: logData };
    } else if (typeof logData === 'object') {
      data = { anObject: logData };
    }
    return data;
  }

  updateSessionId(data) {
    data.sessionId = this.session_id;
  }

  updateUserId(data) {
    if (this.userId) {
      data.userId = this.userId;
    }
  }

  updateTag(data, tag) {
    if (tag) {
      data.tag = tag;
    }
  }

  updateLevel(data, level) {
    if (level) {
      data.level = level;
    }
  }

  updateDeviceProperties(data) {
    data.deviceInfo = data.deviceInfo || {}; // Initialize deviceInfo if not present
    if (this.deviceId) data.deviceInfo.deviceId = this.deviceId;
    if (this.googleId) data.deviceInfo.googleId = this.googleId;
  }

  updateAppCode(data) {
    if (this.appCode) data.appCode = this.appCode;
  }

  updateAppInfo(data) {
    data.appInfo = data.appInfo || {}; // Initialize appInfo if not present
    if (this.versionCode) data.appInfo.versionCode = this.versionCode;
    if (this.versionName) data.appInfo.versionName = this.versionName;
    if (this.buildType) data.appInfo.buildType = this.buildType;
  }

  updateMixPanelProperties(data) {
    if (this.mixPanelId) data.mixPanelId = this.mixPanelId;
  }

  updateCommonProperties(data) {
    this.commonProperties.forEach((value, key) => {
      data[key] = value;
    });
  }

}

export default LogglyTracker;