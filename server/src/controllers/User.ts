import { Request, Response } from "express";
import { User } from "../models/User";

/**Read */
export const getUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }
    return res.status(200).json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

/**retreives all employess that match the vendorId of the vendor querying */
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId;
    const user = await User.findById(vendorId);

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const employees = await User.find({ vendorId: user._id });
    if (!employees) {
      return res.status(404).json({ message: "no employees found" });
    }
    return res.status(200).json(employees);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

/**administrator function that retreives all users */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await User.find();

    if (!allUsers) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(allUsers);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
    const userId = req.params.employeeId;
    let user;
    try {
      user = await User.findByIdAndDelete(userId);
      console.log(user);
      if(user){
        return res.status(200).json({message: "user successfully deleted"})
      }else {
        return res.status(404).json({message: "user does not exist"})
  
      }
    } catch (err: any) {
      return res.status(500).json({err: err.message});
    }
 
}
