const isKeyCombo = require('is-key-combo');
const React = require('react');
const PropTypes = require('prop-types');
const { commands } = require('../utils/constants');
const { getChunks, mediaUpload } = require('../rich');
const { isImage, getDataURL } = require('../utils/media');
const { setSelection } = require('../utils/selection');
const { getText } = require('../state');

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.uploadingItems = [];
  }

  shouldComponentUpdate(nextProps) {
    const props = ['before', 'after', 'startTag', 'endTag', 'selection'];

    return (
      nextProps.className !== this.props.className ||
      props.some((prop) => nextProps.editorState[prop] !== this.props[prop])
    );
  }

  componentDidUpdate() {
    setSelection(this.props.editorState, this.textarea);
  }

  handleKeyDown(event) {
    this.props.commands.forEach((command) => {
      if (command.combo && isKeyCombo(event, command.combo)) {
        event.preventDefault();
        this.props.onKeyCommand(command);
      }
    });
  }

  handleChange(event) {
    const chunks = getChunks(event.target);

    this.props.onChange(chunks);
  }

  handlePaste(event) {
    this.processDataTransferItems(event, event.clipboardData.items);
  }

  handleDrop(event) {
    event.preventDefault();

    this.processDataTransferItems(event, event.dataTransfer.items);
  }

  processDataTransferItems(event, items) {
    if (!items) {
      return;
    }

    [...items].forEach((item) => {
      if (isImage(item)) {
        event.preventDefault();
        event.stopPropagation();

        const file = item.getAsFile();
        mediaUpload(
          () => this.props.editorState,
          this.props.onImageUpload(file),
          this.props.onChange
        );
      } else {
        const file = item.getAsFile();

        this.props.onFileUpload(file);
      }
    });
  }

  render() {
    const { autoFocus, name, editorState } = this.props;
    const text = getText(editorState);

    return React.createElement('textarea', {
      'data-test-id': 'editor-text-area',
      autoFocus,
      ref: (c) => {
        this.textarea = c;
      },
      id: name,
      name,
      value: text,
      className: this.props.className,
      onKeyDown: this.handleKeyDown,
      onChange: this.handleChange,
      onSelect: this.handleChange,
      onPaste: this.handlePaste,
      onDrop: this.handleDrop
    });
  }
}

Editor.defaultProps = {
  content: '',
  name: 'content',
  onChange: () => {},
  onKeyCommand: () => {},
  onImageUpload: (file) =>
    getDataURL(file).then((dataURL) => ({
      src: dataURL,
      alt: 'image'
    })),
  onFileUpload: () => {},
  commands
};

Editor.propTypes = {
  autoFocus: PropTypes.bool,
  editorState: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onKeyCommand: PropTypes.func,
  commands: PropTypes.array
};

module.exports = Editor;
