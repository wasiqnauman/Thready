"use client";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

interface Props {
  user: {
    id: string;
    objectID: string;
    username: string;
    name: string;
    bio: string;
    iamge: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const form = useForm();
  return <Form></Form>;
};

export default AccountProfile;
