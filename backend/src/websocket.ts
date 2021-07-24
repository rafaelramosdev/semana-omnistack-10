import { Server as ServerHttp } from 'http';

import { Server as ServerSocket, Socket } from 'socket.io';

import { parseStringAsString } from './utils/parseStringAsArray';

import { getDistanceFromLatLonInKm } from './utils/calculateDistance';

type Coordinates = {
  latitude: number;
  longitude: number;
};

type ConnectionsProps = {
  id: string;
  coordinates: Coordinates;
  techs: string[];
};

type Location = {
  _id: string;
  type: string;
  coordinates: [ number, number ];
}

type Dev = {
  _id: string;
  name: string;
  github_username: string;
  bio: string;
  avatar_url: string;
  techs: string[],
  location: Location;
}

let io: ServerSocket;

const connections: ConnectionsProps[] = [];

export function setupWebSocket(server: ServerHttp) {
  io = new ServerSocket(server);

  io.on('connection', (socket: Socket) => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      techs: parseStringAsString(String(techs)),
    });
  });
};

export function findConnections(coordinates: Coordinates, techs: string[]) {
  return connections.filter(connection => {
    return getDistanceFromLatLonInKm(coordinates, connection.coordinates) < 10
      && connection.techs.some(tech => techs.includes(tech));
  });
};

export function sendMessage(to: ConnectionsProps[], message: string, data: Dev) {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  })
};