require(["dojo/dom", "dojo/query", "dojo/on", "dojo/request", "showdown", "dojo/domReady!"], function(dom, query, on, request, showdown){

    function resizeFrame(elem) {
         elem.style.height = (window.innerHeight - 280) + "px";
    }

    function getURLParameter(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
    }

    var nodePath = getURLParameter("nodeRef").replace(":/","");

    request.get(Alfresco.constants.PROXY_URI_RELATIVE + "/slingshot/doclib2/node/" + nodePath,{ handleAs: "json"}).then(function(nodeData) {


        var locationPath = Alfresco.constants.PROXY_URI_RELATIVE + "markdown" + nodeData.item.location.repoPath + "/";

        //Once we have the content, let's create a converter and add the html to the div element
        var converter = new showdown.Converter({
            extensions: [
                function() {
                    return [{
                        type: 'output',
                        filter: function(source) {
                            return source.replace(/<img src="([^"]*)"/g, function(match, src) {

                                if(src.startsWith("http")) {
                                    //if this includes external links, then don't change it.
                                    return match;
                                } else {
                                    //if it's a relative link, we need to use our webscript
                                    return "<img src=\"" + locationPath + src + "\"";
                                }
                            });
                        }
                    }]
                }
            ]

        });

        var editorFrame = dom.byId("md-text");
        var previewFrame = dom.byId("md-body");
        var saveBack = dom.byId("markdownSaveback");

        resizeFrame(editorFrame);
        resizeFrame(previewFrame);


        on(window, "resize", function() {
            resizeFrame(editorFrame);
            resizeFrame(previewFrame);
        });

        function updateMarkdown() {

            previewFrame.innerHTML = converter.makeHtml(editorFrame.value);
        }

        on(editorFrame, "change", updateMarkdown);
        on(editorFrame, "keyup", updateMarkdown);
        on(editorFrame, "paste", updateMarkdown);

        request.get(Alfresco.constants.PROXY_URI_RELATIVE + "/api/node/content/" + nodePath).then(function(nodeContent) {
            editorFrame.value = nodeContent;
            updateMarkdown();
        });


        on(saveBack, "click", function() {

            var postHeaders = {
                "Content-Type" : "application/json"
            }

            if (Alfresco.util.CSRFPolicy && Alfresco.util.CSRFPolicy.isFilterEnabled()) {
                postHeaders[Alfresco.util.CSRFPolicy.getHeader()] = Alfresco.util.CSRFPolicy.getToken();
            }

            request.post(Alfresco.constants.PROXY_URI_RELATIVE + "api/node/" + nodePath + "/formprocessor", {
                headers: postHeaders,
                data : JSON.stringify({
                    prop_cm_content : editorFrame.value
                })
            }).then(function() {
                Alfresco.util.PopupManager.displayMessage({"text": "Update Submitted"});
            }, function (err) {
                //Tries to find the exception from the error page and send a prompt
                Alfresco.util.PopupManager.displayPrompt({"title": "Error Updating Alfresco"});
            });

        });

    });

});
