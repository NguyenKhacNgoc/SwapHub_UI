import { FlatList, Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import FooterOnly from "../../layouts/FooterOnly";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCallback } from "react";
import { RefreshControl } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },

  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
});


function MyPosts() {
  const navigation = useNavigation();
  const [posts, setPosts] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get('http://khacngoc.ddns.net:8080/api/getmyPost', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.log(error);
      // Handle error here (e.g., show an error message to the user)
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate('DetailProduct', { post: item })}
    >
      <Image source={{ uri: item.images[0].secureUrl }} style={[styles.productImage, { overlayColor: 'white' }]} />
      <Text style={styles.productName}>{item.title}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
    </TouchableOpacity>
  )

  return (
    <FooterOnly>
      {posts ? (
        <View>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                {item.status === 'pending' && (
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10, marginLeft: 5, color: 'gray' }}>Đang chờ phê duyệt</Text>
                )}
                {item.status === 'hide' && (
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10, marginLeft: 5, color: 'gray' }}>Đã ẩn</Text>
                )}
                {item.status === 'ok' && (
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 10, marginLeft: 5, color: 'green' }}>Đang hiển thị</Text>
                )}
                {renderPostItem({ item })}
              </View>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          />
        </View>
      ) : (
        <View>
          <Text style={{ alignItems: 'center', justifyContent: 'center' }}>Phiên đăng nhập hết hạn, vui lòng đăng nhập lại...</Text>
        </View>
      )}
    </FooterOnly>
  );
}

export default MyPosts;