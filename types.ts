
export enum RiceCollege {
  BAKER = "Baker",
  WILL_RICE = "Will Rice",
  HANSZEN = "Hanszen",
  WIESS = "Wiess",
  JONES = "Jones",
  BROWN = "Brown",
  LOVETT = "Lovett",
  SID_RICHARDSON = "Sid Richardson",
  MARTEL = "Martel",
  MCMURTRY = "McMurtry",
  DUNCAN = "Duncan",
}

export type Location = {
  lat: number;
  lng: number;
};

export type User = {
  id: number;
  name: string;
  college: RiceCollege;
  interests: string;
  location: Location;
};

export type Item = {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl: string;
  college: RiceCollege;
  location: Location;
  status: 'available' | 'sold';
  createdAt: Date;
};

export type ChatMessage = {
  id: number;
  itemId: number;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: Date;
};

export type ChatThread = {
  itemId: number;
  participantIds: number[];
  messages: ChatMessage[];
};
