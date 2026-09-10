export const messageFromFirestore = (docSnapshot) => {
  const data = docSnapshot.data() || {};
  return {
    id: docSnapshot.id,
    senderId: data.senderId || '',
    text: data.text || '',
    createdAt: data.createdAt || null,
    type: data.type || 'text',
  };
};

export const messageToFirestore = ({ senderId, text, type = 'text' }) => ({
  senderId,
  text,
  type,
});
