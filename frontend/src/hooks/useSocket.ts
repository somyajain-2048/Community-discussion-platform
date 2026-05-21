import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

let _socket: Socket | null = null;

export function getSocket(): Socket {
  if (!_socket) {
    _socket = io(SOCKET_URL, {
      autoConnect: false,
      // Allow polling → websocket upgrade (more reliable than websocket-only)
      transports: ["polling", "websocket"],
    });
  }
  return _socket;
}
