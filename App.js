import React from 'react';
import { Alert } from 'react-native';
import Loading from './Loading';
import Weather from './Weather';
import * as Location from 'expo-location';
import axios from 'axios';
import { API_KEY } from './constants';

export default class extends React.Component {
	state = {
		isLoading: true,
		temp: 0,
		condition: '',
	};
	getWeather = async (latitude, longitude) => {
		const {
			data: {
				main: { temp },
				weather,
			},
		} = await axios.get(
			`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`,
		);
		this.setState({
			isLoading: false,
			condition: weather[0].main,
			temp,
		});
	};
	getLocation = async () => {
		try {
			await Location.requestPermissionsAsync();
			const {
				coords: { latitude, longitude },
			} = await Location.getCurrentPositionAsync();
			this.getWeather(latitude, longitude);
			this.setState({ isLoading: false });
		} catch (error) {
			Alert.alert('Weatherly requires access to your location.');
		}
	};
	componentDidMount() {
		this.getLocation();
	}
	render() {
		const { isLoading, temp, condition } = this.state;
		return isLoading || !condition ? (
			<Loading />
		) : (
			<Weather temp={Math.round(temp)} condition={condition} />
		);
	}
}
