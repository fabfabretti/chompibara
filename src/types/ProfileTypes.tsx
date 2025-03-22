export const defaultProfile: ProfileData = {
  height: 0,
  age: 0,
  id: -1,
  name: "name",
  surname: "surname",
  targetcarbo: 0,
  targetfat: 0,
  targetcalories: 0,
  targetprotein: 0,
  weight: 0,
};

export type ProfileData = {
  height: number;
  age: number;
  id: number;
  name: string;
  surname: string;
  targetcarbo: number;
  targetfat: number;
  targetprotein: number;
  weight: number;
  targetcalories: number;
};
