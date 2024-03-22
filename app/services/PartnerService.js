const { notFoundException } = require("../exception");
const PartnerModel = require("../models/partner");
const WorkspaceModel = require("../models/workspace");
const s3service = require("./s3Service");

exports.getAllPartners = async () => {
  const partners = await PartnerModel.find({});
  return partners;
};

exports.getAllPartnersByWorkspace = async (workspaceId) => {
  const partners = await PartnerModel.find({ workspaceId: workspaceId });
  return partners;
};

exports.getPartnerById = async (id) => {
  const partner = await PartnerModel.findById(id);
  return partner;
};

exports.createPartner = async (partner) => {
  const workspaceIdExists = await WorkspaceModel.findOne({
    _id: partner.workspaceId,
  });

  if (!workspaceIdExists) {
    console.log("Workspace not found");
    throw new notFoundException("Workspace not found");
  }

  if (
    partner.image !== null &&
    partner.image !== undefined &&
    partner.image !== ""
  ) {
    const image = partner.image;
    const imageData = await s3service.upload(image, "partners");
    partner.image = imageData.Location;
  }

  const newPartner = await new PartnerModel(partner).save();
  return newPartner;
};

exports.updatePartner = async (id, partner) => {
  if (
    partner.workspaceId &&
    partner.workspaceId !== null &&
    partner.workspaceId !== undefined
  ) {
    const workspaceIdExists = await WorkspaceModel.findOne({
      _id: partner.workspaceId,
    });

    if (!workspaceIdExists) {
      console.log("Workspace not found");
      throw new notFoundException("Workspace not found");
    }
  }

  if (
    partner.image !== null &&
    partner.image !== undefined &&
    partner.image !== ""
  ) {
    const image = partner.image;
    const imageData = await s3service.upload(image, "partners");
    partner.image = imageData.Location;
  }

  const updatedPartner = await PartnerModel.findByIdAndUpdate(id, partner, {
    new: true,
  });
  return updatedPartner;
};

exports.deletePartner = async (id) => {
  const deletedPartner = await PartnerModel.findByIdAndDelete(id);
  return deletedPartner;
};

exports.filterByWorkspace = async (workspaceId) => {
  console.log(workspaceId);
  const partners = await PartnerModel.find({ workspaceId: workspaceId });
  return partners;
};