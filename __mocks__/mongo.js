const mockData = {};

export const connect = jest.fn().mockResolvedValue(true);

export const getCollection = (name) => ({
  insertOne: jest.fn((doc) => {
    mockData[name] = mockData[name] || [];
    mockData[name].push({ ...doc, _id: 'mockId' });
    return Promise.resolve({ insertedId: 'mockId' });
  }),
  findOne: jest.fn((query) => {
    const collection = mockData[name] || [];
    return Promise.resolve(collection.find((doc) => doc._id === query._id));
  }),
});

export const clearMockData = () => {
  for (const key in mockData) delete mockData[key];
};
