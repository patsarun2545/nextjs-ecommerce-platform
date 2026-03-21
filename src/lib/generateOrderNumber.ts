export const generateOrderNumber = () => {
  const prefix = "ORD";
  const timestamp = new Date().getTime().toString().substring(3, 10);
  const ramdom = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${prefix}${timestamp}${ramdom}`;
};
