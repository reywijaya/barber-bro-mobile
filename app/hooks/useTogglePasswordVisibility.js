import { useState } from "react";

export const useTogglePasswordVisibility = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [rightIcon, setRightIcon] = useState("eye");
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
        if (rightIcon === "eye") {
            setRightIcon("eye-off");
        } else if (rightIcon === "eye-off") {
            setRightIcon("eye");
        }
    };
    return { isPasswordVisible, togglePasswordVisibility, rightIcon };
};