import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';

import NConstraint from '../constraints/NConstraint';
import FineUploader from '../third_party/FineUploader';

class FileUploaderExample extends Component {
    constructor() {
        super(...arguments);
        this.doGetFile = this.doGetFile.bind(this);
        this.onSessionRequestComplete = this.onSessionRequestComplete.bind(this);
    }

    // Compoent Render 이전 이벤트
    componentWillMount() {

    }

    doGetFile(){
        this.refs.file.refreshSession({atch_file_id: 178});
    }

    onSessionRequestComplete(response, success, xhr, fineUploader){
        let fileList = response;
        if(fileList.length > 0){
            fileList.forEach((file, idx) => {
                var fileSelector = qq(fineUploader.getItemByFileId(idx)).getByClass('qq-upload-file-selector')[0];
                $(fileSelector).replaceWith("<span class='qq-upload-file-selector qq-upload-file' title="+file.name+"><a href='http://localhost:8090/itg/base/downloadAtchFile.do?atch_file_id="+file.atch_file_id+"&file_idx="+file.file_idx+"' download='"+file.name+"'>"+file.name+"</a></span>" );
            });
        }
    }

    render() {
        return (
            <div>
                <FineUploader ref="file" host={NConstraint.HOST} sessionUrl="/itg/base/selectAjaxAtchFileList.do" uploadUrl="/itg/base/ajaxFileUpload.do" deleteUrl="/itg/base/ajaxRemoveFile.do" onSessionRequestComplete={this.onSessionRequestComplete} />
                <button onClick={this.doGetFile}>파일정보 불러오기</button>
            </div>
        );
    }
}

FileUploaderExample.propTypes = {
	links: PropTypes.object
};

FileUploaderExample.defaultProps = {
};

export default FileUploaderExample;
