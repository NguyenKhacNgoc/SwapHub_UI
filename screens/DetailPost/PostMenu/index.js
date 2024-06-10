import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { StyleSheet, Text } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
const styles = StyleSheet.create({
    menuContainer: {
      backgroundColor: 'white',
      borderRadius: 4,
      padding: 8,
    },
    
  });
function PostMenu({onHide, onReport}) {
    
    return (
        <Menu style={styles.menuContainer}>
            <MenuTrigger>
                <FontAwesomeIcon icon={faEllipsisVertical} size={20} />
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: styles.menuContainer }}>
                <MenuOption onSelect={onHide} >
                    <Text>Ẩn tin/Đã bán</Text>
                </MenuOption>
                <MenuOption onSelect={onReport}>
                    <Text>Tố cáo</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>

    )
}

export default PostMenu;