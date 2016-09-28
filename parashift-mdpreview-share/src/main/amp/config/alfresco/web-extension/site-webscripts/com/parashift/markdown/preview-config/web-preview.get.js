if (model.widgets)
{
    for (var i = 0; i < model.widgets.length; i++)
    {
        var widget = model.widgets[i];
        if (widget.id == "WebPreview" && url.args.nodeRef)
        {

            //We need to know some extra bits about the node, such as the repoPath to display images
            pObj = eval('(' + remote.call("/slingshot/doclib2/node/" + url.args.nodeRef.replace(":/","")) + ')');

            //We check to see if the mime type is markdown, and if so, overwrite the conditions object.
            if(pObj.item && pObj.item.node && pObj.item.node.mimetype == "text/x-markdown") {

                var conditions = [{
                    attributes: {
                        mimeType: "text/x-markdown"
                    },
                    plugins: [{
                        name: "MarkDown",
                        attributes: pObj.item
                    }]
                }];

                // Override the original conditions
                model.pluginConditions = jsonUtils.toJSONString(conditions);
                widget.options.pluginConditions = model.pluginConditions;

            }

        }
    }
}
