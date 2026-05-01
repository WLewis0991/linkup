type Message = {
  content: string;
  from: {
    id: string;
    username: string;
  };
  timestamp: string;
};

export type {Message};