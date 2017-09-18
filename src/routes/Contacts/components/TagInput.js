import React, { Component } from "react";
import { Tag, AutoComplete, message } from "antd";

class TagInput extends Component {
  state = {
    search: "",
    value: ""
  };

  handleChange = e => {
    const { tags, addNewTag } = this.props;
    if (e.key != "Enter") return;
    const label = e.target.value.trim();
    if (tags.find(tg => tg.label == label)) {
      message.error(`Tag ${label} already exists`);
      return;
    }
    return addNewTag(label).then(() => this.setState({ search: "" }));
  };

  render() {
    const {
      tags,
      addNewTag,
      onTagSelect,
      selectedTagSet = {},
      onClose
    } = this.props;
    const { search, value } = this.state;
    const { handleChange } = this;

    const renderTag = tag => (
      <Tag key={tag.key} closable onClose={() => onClose(tag)}>
        {tag.label}
      </Tag>
    );

    const filterTags = str =>
      tags
        .filter(
          tg => tg.label && !selectedTagSet[tg.key] && tg.label.includes(str)
        )
        .map(tg => tg.label);

    console.log("tags", tags);
    console.log("activetags", selectedTagSet);

    return (
      <div className="tag-input-container">
        {Object.keys(selectedTagSet)
          .map(key => tags.find(tg => tg.key == key))
          .filter(tg => tg != null)
          .map(renderTag)}
        <AutoComplete
          dataSource={filterTags(search)}
          className="tag-input-box"
          value={search}
          onSearch={search => this.setState({ search })}
          onSelect={label => {
            console.log("selected", label);
            this.setState({ search: "" });
            onTagSelect(tags.find(tg => tg.label == label));
          }}
        >
          <input
            className="tag-inputbox"
            value={search}
            onKeyPress={handleChange}
          />
        </AutoComplete>
      </div>
    );
  }
}

export default TagInput;
