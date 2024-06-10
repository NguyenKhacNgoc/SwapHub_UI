
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, TextInput, FlatList, Image, StyleSheet } from 'react-native';
const Search = () => {
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState()
    const navigation = useNavigation()
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([])
    const [copyProducts, setCopyProducts] = useState([])
    const filterType = ['Mặc định', 'Giá cao nhất', 'Giá thấp nhất']
    const [filterIndex, setFilterIndex] = useState(0)
    const handlePressFilter = () => {
        //Làm sao để khi
        setFilterIndex((prevIndex) => (prevIndex + 1) % filterType.length)
        const sortedProduct = sortProducts([...copyProducts], filterType[filterIndex])
        setProducts(sortedProduct)
    }
    const sortProducts = (products, sortType) => {
        switch (sortType) {
            case 'Giá cao nhất': return products.sort((a, b) => b.price - a.price)
            case 'Giá thấp nhất': return products.sort((a, b) => a.price - b.price)
            default: return copyProducts
        }

    }
    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://khacngoc.ddns.net:8080/api/search/result?searchText=${searchText}`)
            setProducts(response.data)
            setCopyProducts(response.data)

        } catch (error) {
            setProducts([])
        }
    }
    useEffect(() => {
        const getCategory = async() => {
            try{
                const response = await axios.get('http://khacngoc.ddns.net:8080/api/getNameCategory')
                setCategories(response.data)
            }catch(error) {
                console.log(error)
                setCategories([])
            }
        }
        getCategory()

    }, [selectedCategory])

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Tìm kiếm sản phẩm</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập từ khóa tìm kiếm"
                onChangeText={text => setSearchText(text)}
                onSubmitEditing={handleSearch}
            />
            <TouchableOpacity onPress={handlePressFilter}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{filterType[filterIndex]}</Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 10 }}>Thể loại</Text>
            <Picker
                style={{padding:0}}
                selectedValue={selectedCategory}
                onValueChange={(itemValue, itemIndex) => {
                    if (itemValue === 'Tất cả') {
                        setSelectedCategory(itemValue)
                        setProducts(copyProducts)
                    }
                    else {
                        setSelectedCategory(itemValue)
                        setProducts(copyProducts.filter(product => product.category === itemValue))
                    }

                }}

            >
                <Picker.Item label="Chọn thể loại" value={null} enabled={false}/>
                {categories.map((category) => (
                    <Picker.Item label={category} value={category} key={category} />

                ))}


            </Picker>

            <FlatList
                data={products}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => { navigation.navigate('DetailProduct', { post: item }) }}>

                        <View style={styles.productItem}>
                            <Image source={{ uri: item.images[0].secureUrl }} style={styles.productImage} />
                            <View>

                                <Text style={styles.productName}>{item.title}</Text>
                                <Text style={{ color: 'red' }}>{item.price}</Text>
                                <Text>{item.profile.fullName}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    productImage: {
        width: 50,
        height: 50,
        marginRight: 10,
        borderRadius: 25,
    },
    productName: {
        fontSize: 16,
    },
});

export default Search;
