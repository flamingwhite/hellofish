import { connect } from "react-redux";
import React, { Component } from "react";
import validator from "validator";
import R from "ramda";
import { Button, message, Popconfirm, Spin } from "antd";
import LabelFieldSet from "../../../commonCmps/LabelFieldSet";
import simpleForm from "../../../lib/simpleForm";
import ImageViewer from "../../../commonCmps/ImageViewer";
import { getBusinessCardRef } from "../../../fireQuery/fireConnection";
import createUUID from "../../../lib/uuidTool";
import TagInputContainer from "../containers/TagInputContainer";

const validation = ({ name = "", email = "", phone = "", address = "" }) => {
  const err = {};
  if (name.trim().length == 0) err.name = "Name cannot be blank";
  if (!R.isEmpty(email.trim()) && !validator.isEmail(email))
    err.email = "Email is not valid";
  // if (!R.isEmpty(phone.trim()) && !validator.isMobilePhone(phone, 'any')) err.phone = 'Phone is not valid';
  // console.log('errs ', err);
  return err;
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

@connect()
@simpleForm({
  fields: [
    "name",
    "email",
    "phone",
    "company",
    "address",
    "website",
    "instagram",
    "facebook",
    "tagKeySet",
    "comments",
    "downloadURL",
    "cardImageName"
  ],
  validate: validation
})
class ContactItemForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onDeleteFile = this.onDeleteFile.bind(this);

    this.state = {
      cardImage: null,
      cardImageName: null,
      imageDeleted: false,
      uploadLoading: false,
      imageSrc: props.initData && props.initData.downloadURL
    };
    this.originalImageSrc = this.state.imageSrc;
    this.originalImageName = props.initData && props.initData.cardImageName;
  }
  onFileSelect(file) {
    console.log("on file select", file);
    this.setState({
      cardImage: file,
      cardImageName: createUUID(),
      imageDeleted: false
    });

    // getBusinessCardRef().child('abc.jpg').put(file).then(d => console.log('file upload', d))
    getBase64(file, imageSrc =>
      this.setState({
        imageSrc
      })
    );
  }
  onDeleteFile() {
    this.setState({
      imageSrc: null,
      cardImage: null,
      cardImageName: null,
      imageDeleted: true
    });
  }

  async submit() {
    const { fields, isFormValid, onOk, preSubmit } = this.props;
    const { cardImage, cardImageName, imageDeleted } = this.state;
    const { originalImageName } = this;

    console.log("to update the fields", fields);
    preSubmit();
    if (!isFormValid) {
      message.error("Information is not valid");
      return;
    }

    let toUpdate = { ...fields };

    let downloadURL = null;

    this.setState({ uploadLoading: true });

    if (imageDeleted) {
      toUpdate.cardImageName = null;
      toUpdate.downloadURL = null;
    } else if (
      cardImage &&
      cardImageName &&
      originalImageName != cardImageName
    ) {
      const snap = await getBusinessCardRef()
        .child(cardImageName)
        .put(cardImage);
      downloadURL = snap.downloadURL;
      // contact.downloadURL = downloadURL;
      toUpdate.downloadURL = downloadURL;
      toUpdate.cardImageName = cardImageName;
    }

    this.setState({ uploadLoading: false });

    console.log("data ", toUpdate);
    onOk(toUpdate);
  }
  render() {
    console.log("fields", this.props);

    const { submit, onFileSelect, onDeleteFile } = this;
    const {
      initData,
      fields,
      name,
      phone,
      email,
      address,
      company,
      website,
      instagram,
      facebook,
      comments,
      hasSubmitted,
      okText = "Ok",
      cancelText = "Cancel",
      onOk,
      onCancel,
      isFormValid,
      showDelete,
      onDelete,
      loading = false,
      loadingText = "Loading",
      tagKeySet = {}
	} = this.props;
	
    const { cardImage, imageSrc, uploadLoading } = this.state;

    return (
      <Spin tip={loadingText} spinning={uploadLoading || loading}>
        <div>
          <LabelFieldSet
            label="Name"
            err={(hasSubmitted || name.touched) && name.error}
          >
            <input className="form-control" {...name} />
          </LabelFieldSet>
          <LabelFieldSet
            label="email"
            err={(hasSubmitted || email.touched) && email.error}
          >
            <input className="form-control" {...email} />
          </LabelFieldSet>
          <LabelFieldSet
            label="Phone"
            err={(hasSubmitted || phone.touched) && phone.error}
          >
            <input className="form-control" {...phone} />
          </LabelFieldSet>
          <LabelFieldSet
            label="Address"
            err={(hasSubmitted || address.touched) && address.error}
          >
            <input className="form-control" {...address} />
          </LabelFieldSet>
          <LabelFieldSet
            label="Company"
            err={(hasSubmitted || company.touched) && company.error}
          >
            <input className="form-control" {...company} />
          </LabelFieldSet>
          <LabelFieldSet
            label="Website"
            err={(hasSubmitted || website.touched) && website.error}
          >
            <input className="form-control" {...website} />
          </LabelFieldSet>
          <LabelFieldSet
            label="Instagram"
            err={(hasSubmitted || instagram.touched) && instagram.error}
          >
            <input className="form-control" {...instagram} />
          </LabelFieldSet>
          <LabelFieldSet
            label="Facebook"
            err={(hasSubmitted || facebook.touched) && facebook.error}
          >
            <input className="form-control" {...facebook} />
          </LabelFieldSet>
          <LabelFieldSet
            label="Comments"
            err={(hasSubmitted || comments.touched) && comments.error}
          >
            <textarea className="form-control" {...comments} />
          </LabelFieldSet>

          <LabelFieldSet
            label="Tags"
            err={(hasSubmitted || tagKeySet.touched) && tagKeySet.error}
          >
            <div style={{ borderBottom: "1px solid lightgray" }}>
              <TagInputContainer
                selectedTagSet={tagKeySet.value}
                onTagSetChange={keySet => tagKeySet.onChange(undefined, keySet)}
              />
            </div>
          </LabelFieldSet>

          <ImageViewer
            onFileSelect={onFileSelect}
            buttonText={"Upload Business Card"}
            onDeleteFile={onDeleteFile}
            imageSrc={imageSrc}
          />
          <Button
            style={{ marginTop: 10 }}
            type="primary"
            disabled={hasSubmitted && !isFormValid}
            onClick={submit}
          >
            {okText}
          </Button>
          <Button style={{ marginLeft: 20 }} type="default" onClick={onCancel}>
            {cancelText}
          </Button>
          {showDelete && (
            <Popconfirm
              title="Are you sure to delete this contact?"
              onConfirm={onDelete}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ float: "right" }} type="danger" ghost>
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      </Spin>
    );
  }
}
export default ContactItemForm;
