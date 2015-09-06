const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
var oldRetriever;
var Zotero;

/*
 * Zotero runs citeproc-js synchronously within an async thread. We
 * can retrieve modules synchronously inside citeproc-js, and the
 * additional I/O will not impact the UI. Whew.
 */

function ifZotero(succeed, fail) {
    var ZoteroClass = Cc["@zotero.org/Zotero;1"];
    if (ZoteroClass && ZoteroClass.getService) {
        Zotero = ZoteroClass
	        .getService(Ci.nsISupports)
	        .wrappedJSObject;
        succeed ? succeed(Zotero) : null;
    } else {
        fail ? fail() : null;
    }
}

function getRetriever (Zotero) {
    return function (jurisdiction, preference) {
        jurisdiction = jurisdiction.replace(/\:/g, "+");
	    var id = preference ? "juris-" + jurisdiction + "-" + preference : "juris-" + jurisdiction;
        var ret;
        try {
	        ret = Zotero.File.getContentsFromURL("chrome://myles-styles/content/" + id + ".csl");
        } catch (e) {
            ret = false;
        }
        return ret;
    }
}

function UiObserver() {
    this.register();
}

UiObserver.prototype = {
    observe: function(subject, topic, data) {
        ifZotero(
            function (Zotero) {
                Zotero.CiteProc.CSL.retrieveStyleModule = getRetriever(Zotero);
            },
            null
        );
    },
    register: function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"]
            .getService(Components.interfaces.nsIObserverService);
        observerService.addObserver(this, "final-ui-startup", false);
    },
    unregister: function() {
        var observerService = Components.classes["@mozilla.org/observer-service;1"]
            .getService(Components.interfaces.nsIObserverService);
        observerService.removeObserver(this, "final-ui-startup");
    }
}
var uiObserver = new UiObserver();


/*
 * Bootstrap functions
 */

function startup (data, reason) {
    ifZotero(
        function (Zotero) {
            // Set immediately if we have Zotero
            Zotero.CiteProc.CSL.retrieveStyleModule = getRetriever(Zotero);
        },
        function () {
            // If not, assume it will arrive by the end of UI startup
            uiObserver.register();
        }
    );
}

function shutdown (data, reason) {
    uiObserver.unregister();
    ifZotero(
        function (Zotero) {
            Zotero.CiteProc.CSL.retrieveStyleModule = oldRetriever;
        },
        null
    );
}

function install (data, reason) {}
function uninstall (data, reason) {}
