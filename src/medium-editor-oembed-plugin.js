function MediumEditorOembedPlugin (options) {
    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action';
    if (this.button.innerText) {
        this.button.innerText = options.buttonText || "</>";
    } else {
        this.button.textContent = options.buttonText || "</>";
    }
    this.button.onclick = this.onClick.bind(this);
    this.options = options;

    this.insertHtmlAtCaret = function (html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    };

    this.getOEmbedHTML = function(url, cb) {
        $.ajax({
            url: options.oembedProxy,
            dataType: "json",
            data: {
                url: url
            },
            success: function(data, textStatus, jqXHR) {
                cb(null, data, jqXHR);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                var responseJSON = function() {
                    try {
                        return JSON.parse(jqXHR.responseText);
                    } catch(e) {}
                }();

                cb((responseJSON && responseJSON.error) || jqXHR.status || errorThrown.message, responseJSON, jqXHR);
            }
        });
    };
}

/**
 * onClick
 * The click event handler that calls `insertHtmlAtCaret` method.
 *
 * @name onClick
 * @function
 */
MediumEditorOembedPlugin.prototype.onClick = function() {
    // TODO: get url from selected fragment.

    var url = window.getSelection() + '';

    var that = this;

    this.getOEmbedHTML(url, function(error, oebmed) {

        var html = !error && oebmed && oebmed.html;

        if (oebmed && !oebmed.html && oebmed.type === 'photo' && oebmed.url) {
            html = '<img src="' + oebmed.url + '" />';
        }

        if (html) {
            // Fix for local test.
            html = html.replace('"//', '"http://');

            that.insertHtmlAtCaret(html);
        }
    });
};

/**
 * getButton
 * This function is called by the Medium Editor and returns the button that is
 * added in the toolbar
 *
 * @name getButton
 * @function
 * @return {HTMLButtonElement} The button that is attached in the Medium Editor
 * toolbar
 */
MediumEditorOembedPlugin.prototype.getButton = function() {
    return this.button;
};
