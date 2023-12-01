import {Button as NativeBaseButton, IButtonProps, Text} from 'native-base'

interface ButtonProps extends IButtonProps{
    title: string,
    variant?: "solid" | "outline"
}
function Button({title, variant = "solid", ...props} : ButtonProps) {
    return (
        <NativeBaseButton
            w={"full"}
            h={14}
            bg={variant !== "outline" ? "green.700" : "transparent"}
            rounded={"md"}
            borderWidth={variant !== "outline" ? 0 : 1}
            borderColor={variant !== "outline" ? "transparent" : "green.700"}
            _pressed={{
                bg: "green.500"
            }}
            {...props}
        >
            <Text
                color={variant !== "outline" ? "white" : "green.700"}
                fontFamily={"heading"}
                fontSize={"sm"}
            >
                {title}
            </Text>
        </NativeBaseButton>
    );
}

export default Button;