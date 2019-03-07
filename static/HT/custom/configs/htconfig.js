window.htconfig = {
    Default: {
        toolTipDelay: 100,
        toolTipContinual: true,
        convertURL: function(url) {
            var storagePrefix = '';
            if (storagePrefix && url && !/^data:image/.test(url) && !/^http/.test(url) && !/^https/.test(url)) {
                url = storagePrefix + '/' + url
            }
            // append timestamp
            url += (url.indexOf('?') >= 0 ? '&' : '?') + 'ts=' + Date.now();
            // append sid
            if (window.editor && window.editor.sid) {
               url += '&sid=' + window.editor.sid;
            }
            return url;
        }
    }
};
