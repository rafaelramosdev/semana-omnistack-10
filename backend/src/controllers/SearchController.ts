import { Request, Response } from 'express';

import Dev from '../models/Dev';

import { parseStringAsString } from '../utils/parseStringAsArray';

export default {
  async index(request: Request, response: Response) {
    const { latitude, longitude, techs } = request.query;

    const techsArray = parseStringAsString(String(techs));

    const devs = Dev.find({
      techs: {
        $in: techsArray,
      },
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    });

    return response.send(devs);
  }
};