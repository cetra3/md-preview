<@markup id="css" >
    <#-- CSS Dependencies -->
    <@link href="${url.context}/res/components/preview/MarkDown.css" group="markdown"/>
    <@link href="${url.context}/res/components/markdown-edit.css" group="markdown"/>
</@>

<@markup id="js">
    <#-- JavaScript Dependencies -->
    <@script src="${url.context}/res/components/markdown-edit.js" group="markdown"/>
</@>


<@markup id="html">
    <@uniqueIdDiv>

    <div class="markdown-section">
        <div class="markdown-editor" id="md-edit">
            <h1>Editor:</h1>
            <textarea class="markdown-text" id="md-text"></textarea>
        </div>
        <div class="markdown-preview" id="md-preview">
            <h1>Preview:</h1>
            <div class="markdown-body" id="md-body">
            </div>
        </div>
    </div>

    <div class="markdown-save-back">
        <div class="form-buttons">
            <span class="yui-button yui-submit-button alf-primary-button">
                <span class="first-child">
                    <button type="button" id="markdownSaveback">Save Markdown</button>
                </span>
            </span>
        </div>
    </div>

    </@>
</@>
