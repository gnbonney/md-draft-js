const classNames = require('classnames');
const React = require('react');
const commands = require('./commands');
const { Editor, EditorState, RichUtils } = require('../src');
const { isApplied } = require('../src/rich');

const content = '# Sample title\n\nYour content goes here.';

module.exports = class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = { editorState: EditorState.createWithContent(content) };
    this.onChange = (editorState) => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand({ key }) {
    const newState = RichUtils.applyCommand(this.state.editorState, key);

    if (newState) {
      this.onChange(newState);
    }
  }

  onClickCommand(command) {
    this.onChange(RichUtils.applyCommand(this.state.editorState, command));
  }

  onLinkClick() {
    const link = global.prompt('Link URL:');

    if (link) {
      this.onChange(
        RichUtils.applyCommand(this.state.editorState, 'link', link)
      );
    }
  }

  onImageClick() {
    const image = global.prompt('Image URL:');

    if (image) {
      this.onChange(
        RichUtils.applyCommand(this.state.editorState, 'media', image)
      );
    }
  }

  render() {
    return (
      <div className="editor">
        <div className="editor-buttons">
          {commands.map(({ command, label, icon }, key) => (
            <button
              key={key}
              className={classNames(
                'editor-action',
                this.state.editorState.getCurrentInlineStyle().has(command)
                  ? 'active'
                  : ''
              )}
              onClick={this.onClickCommand.bind(this, command)}
              aria-label="Bold"
            >
              <i
                key={`span-${key}`}
                className={`fas fa-${icon || command}`}
                aria-hidden="true"
              />
            </button>
          ))}
          <button
            className="editor-action"
            onClick={this.onLinkClick.bind(this)}
            aria-label="Link"
          >
            <span className="glyphicon glyphicon-link" aria-hidden="true" />
          </button>
          <button
            className="editor-action"
            onClick={this.onImageClick.bind(this)}
            aria-label="Image"
          >
            <span className="glyphicon glyphicon-picture" aria-hidden="true" />
          </button>
        </div>
        <Editor
          autoFocus
          className="editor-textarea"
          editorState={this.state.editorState}
          onKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
};
