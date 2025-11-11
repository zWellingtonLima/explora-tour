import { Request, Response } from "express";
import getStatusData from "models/getDBStatusData";

const getStatusController = async (req: Request, res: Response) => {
  try {
    const statusData = await getStatusData();
    return res.status(200).json(statusData);
  } catch (err) {
    console.error("Get /api/v1/status error: ", err);

    return res.status(500).json({
      error: "Internal_server_error",
      message: "It was not possible retrieve system status.",
    });
  }
};

export = getStatusController;
