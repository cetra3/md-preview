package com.parashift.mdpreview.webscript;

import org.alfresco.model.ContentModel;
import org.alfresco.repo.model.Repository;
import org.alfresco.service.cmr.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.webscripts.AbstractWebScript;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.extensions.webscripts.WebScriptResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.OutputStream;
import java.io.Serializable;
import java.util.Map;

/**
 * Created by cetra on 30/08/2016.
 */

@Component(value = "webscript.mdpreview.path.get")
public class ContentGet extends AbstractWebScript {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    protected Repository repository;

    @Autowired
    ContentService contentService;


    @Override
    public void execute(WebScriptRequest req, WebScriptResponse res) throws IOException {


        // create map of template vars
        Map<String, String> templateVars = req.getServiceMatch().getTemplateVars();

        //nodepath is like: /Sites/md-test/documentLibrary/giraffe
        String nodePath = "workspace/SpacesStore/Company Home/" + templateVars.get("nodepath").replaceFirst("^/","");

        logger.debug("node path is:{}", nodePath);

        NodeRef nodeRef = repository.findNodeRef("path", nodePath.split("/"));

        logger.debug("node ref is:{}", nodeRef);

        if(nodeRef != null) {

            ContentReader reader = contentService.getReader(nodeRef, ContentModel.PROP_CONTENT);

            if(reader != null) {

                logger.debug("found reader for nodeRef:{}, streaming content of type:{}", nodeRef, reader.getMimetype());
                res.setContentType(reader.getMimetype());

                try(OutputStream outputStream = res.getOutputStream()) {
                    reader.getContent(outputStream);
                }
            } else {
                throw new IOException("Could not read content property for node: " + nodeRef);
            }

        } else {
            throw new IOException("Could not find node at path: " + nodePath);
        }


    }
}
