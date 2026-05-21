import { Request, Response } from "express";

import { searchAllService } from "./search.service";

export const searchAll = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;

    const result = await searchAllService(query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
