import { Response } from "express";

type SuccessResponseType<T> = {
  message?: string;
  statusCode?: number;
  metadata?: T;
};

class SuccessResponse {
  message = "";
  statusCode = 200;
  metadata: unknown = {};

  constructor({ message = "", statusCode = 200, metadata = {} }: SuccessResponseType<unknown>) {
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send = (res: Response) => {
    return res.status(this.statusCode).json(this);
  };
}

class OK extends SuccessResponse {
  constructor({ message = "Successfully", metadata = {} }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({ message = "Successfully", statusCode = 201, metadata = {} }) {
    super({ message, statusCode, metadata });
  }
}

export { SuccessResponse, OK, CREATED };
