const isKeyCombo = require('is-key-combo');
const React = require('react');
const PropTypes = require('prop-types');
const { commands } = require('../utils/constants');
const { getChunks } = require('../rich');
const { setSelection } = require('../utils/selection');
const { getText } = require('../state');

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
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

  handleKeyDown(e) {
    this.props.commands.forEach((command) => {
      if (command.combo && isKeyCombo(e, command.combo)) {
        e.preventDefault();
        this.props.onKeyCommand(command);
      }
    });
  }

  handleChange(e) {
    const { onChange } = this.props;
    const chunks = getChunks(e.target);

    onChange(chunks);
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
      onSelect: this.handleChange
    });
  }
}

Editor.defaultProps = {
  content: '',
  name: 'content',
  onChange: () => {},
  onKeyCommand: () => {},
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
