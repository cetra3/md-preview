(function() {

    Alfresco.WebPreview.prototype.Plugins.MarkDown = function(wp, attributes)
    {
        this.wp = wp;
        this.attributes = YAHOO.lang.merge(Alfresco.util.deepCopy(this.attributes), attributes);
        return this;
    };

    Alfresco.WebPreview.prototype.Plugins.MarkDown.prototype =
    {
        attributes: {},

        report: function() {
            return null;
        },

        display: function() {

            var node = this.attributes.node;

            //get the default relative path of the node
            var locationPath = Alfresco.constants.PROXY_URI_RELATIVE + "/markdown" + this.attributes.location.repoPath + "/";

            //get the Div Element we'll be putting the Markdown
            var divElem = document.getElementById(this.wp.id + "-body")



            //Execute Ajax request for content
            require(["dojo/request", "showdown"], function(request, showdown){


                //Once we have the content, let's create a converter and add the html to the div element
                converter = new showdown.Converter({
                    extensions: [
                        function() {
                            return [{
                                type: 'output',
                                filter: function(source) {
                                    return source.replace(/<img src="([^"]*)"/, function(match, src) {

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


                request.get(Alfresco.constants.PROXY_URI_RELATIVE + node.contentURL).then(function(mdData) {


                    newHtml = converter.makeHtml(mdData);

                    console.log(newHtml);
                    console.log(divElem);

                    divElem.className = "markdown-body";
                    divElem.innerHTML = converter.makeHtml(mdData);


                });

            });

            console.log(this.wp);
            console.log(this.attributes);

        }
    }

})();
