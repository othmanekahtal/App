import React, {memo, useMemo} from 'react';
import type {StyleProp, TextStyle} from 'react-native';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import Text from './Text';

type TextBlockProps = {
    /** The color of the text */
    color?: string;

    /** Styles to apply to each text word */
    textStyles?: StyleProp<TextStyle>;

    /** The full text to be split into words */
    text: string;
};

function TextBlock({color, textStyles, text}: TextBlockProps) {
    const theme = useTheme();
    const styles = useThemeStyles();

    const words = useMemo(() => text.match(/(\S+\s*)/g) ?? [], [text]);

    return (
        <>
            {words.map((word) => (
                <Text
                    color={color ?? theme.placeholderText}
                    style={textStyles ?? [styles.textAlignCenter, styles.textNormal]}
                >
                    {word}
                </Text>
            ))}
        </>
    );
}

TextBlock.displayName = 'TextBlock';

export default memo(TextBlock);
