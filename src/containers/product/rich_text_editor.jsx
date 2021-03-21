import React, { Component } from 'react';
import {withRouter} from 'react-router-dom'
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


@withRouter
 class RichTextEditor extends Component {
  state = {
    editorState: EditorState.createEmpty(), //构建一个初始化状态的编辑器+内容
  }

  componentDidMount(){
    this.props.onRef && this.props.onRef(this);
    }


  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  //获取富文本内容
  getRichText = ()=>{
    const {editorState} = this.state
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  //回显富文本内容
  setRichText = (html)=>{
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState,
      });
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          //wrapperClassName="demo-wrapper" //最外侧容器的样式
          //editorClassName="demo-editor"//编辑区域的样式
          //给编辑区域设置样式,不用外部引入,上面两个是外部引入自定义样式
          editorStyle={{
            border:' 1px solid #ccc',
            paddingLeft:'10px',
            lineHeight: '10px',
            minHeight: '200px'
          }}
          onEditorStateChange={this.onEditorStateChange}
        />
      </div>
    );
  }
}

export default RichTextEditor