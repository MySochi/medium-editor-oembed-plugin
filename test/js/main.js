window.onload = function () {
    var myEditor = new MediumEditor(".container", {
        buttons: [
            "bold"
          , "italic"
          , "underline"
          , "anchor"
          , "header1"
          , "header2"
          , "quote"
          , "oembedPlugin"
        ]
      , extensions: {
            "oembedPlugin": new MediumEditorOembedPlugin({
                oembedProxy: 'http://medium.iframe.ly/api/oembed?iframe=1'
            })
        }
    });
};
