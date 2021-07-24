import { Request, Response } from 'express';

import axios from 'axios';

import Dev from '../models/Dev';

import { findConnections, sendMessage } from '../websocket';

import { parseStringAsString } from '../utils/parseStringAsArray';

type GithubApiResponse = {
  name?: string;
  login: string;
  avatar_url: string;
  bio: string;
};

export default {
  async index(request: Request, response: Response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request: Request, response: Response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const githubApiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
  
      let { name, avatar_url, bio, login } = githubApiResponse.data as GithubApiResponse;
  
      if (!name)
        name = login;
  
      const techsArray = parseStringAsString(techs);
  
      const location = {
        type: 'Point',
        coordinates: [ longitude, latitude ],
      };
  
      dev = await Dev.create({
        name,
        github_username,
        bio,
        avatar_url,
        techs: techsArray,
        location,
      });

      const sendSocketMessageTo = findConnections({
        latitude,
        longitude
      }, techsArray);

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return response.json(dev);
  }
};