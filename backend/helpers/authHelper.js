import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    // console.log(`Error during hashing password: ${error}`);
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    // console.log(`Error during comparing password: ${error}`);
  }
};

export { hashPassword, comparePassword };
