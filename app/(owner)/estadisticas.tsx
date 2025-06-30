import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 80;

export default function EstadisticasScreen() {
  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#00796b' },
  };

  const reservasPorDia = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{ data: [8, 12, 10, 15, 14, 18, 9] }],
  };

  const ingresosPorMes = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{ data: [15000, 17000, 16000, 20000, 22000, 21000] }],
  };

  const tiposDeCancha = [
    {
      name: 'Césped sintético',
      population: 50,
      color: '#009688',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Hormigón',
      population: 30,
      color: '#00796b',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Madera',
      population: 20,
      color: '#4db6ac',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  const reservasPorHora = {
    labels: ['08h', '10h', '12h', '14h', '16h', '18h', '20h'],
    datasets: [{ data: [4, 6, 9, 12, 14, 10, 5] }],
  };

  const ocupacionPorCancha = {
    labels: ['Cancha 1', 'Cancha 2', 'Cancha 3'],
    datasets: [{ data: [80, 60, 90] }],
  };

  const jugadoresFrecuentes = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{ data: [20, 23, 27, 30, 33, 35] }],
  };

  const ausenciasPorSemana = {
    labels: ['S1', 'S2', 'S3', 'S4'],
    datasets: [{ data: [2, 1, 4, 3] }],
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Estadísticas Generales</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Reservas por día</Text>
          <BarChart
            data={reservasPorDia}
            width={chartWidth}
            height={160}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
            showValuesOnTopOfBars
            style={styles.chartStyle}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Ingresos por mes (en $)</Text>
          <LineChart
            data={ingresosPorMes}
            width={chartWidth}
            height={160}
            chartConfig={chartConfig}
            bezier
            fromZero
            style={styles.chartStyle}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Tipos de piso de cancha</Text>
          <PieChart
            data={tiposDeCancha}
            width={chartWidth}
            height={160}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="20"
            absolute
            style={styles.chartStyle}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Reservas por hora del día</Text>
          <BarChart
            data={reservasPorHora}
            width={chartWidth}
            height={160}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.chartStyle}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Ocupación por cancha (%)</Text>
          <BarChart
            data={ocupacionPorCancha}
            width={chartWidth}
            height={160}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.chartStyle}
            yAxisSuffix="%"
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Usuarios frecuentes por mes</Text>
          <LineChart
            data={jugadoresFrecuentes}
            width={chartWidth}
            height={160}
            chartConfig={chartConfig}
            bezier
            fromZero
            style={styles.chartStyle}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.subtitle}>Cancelaciones por semana</Text>
          <BarChart
            data={ausenciasPorSemana}
            width={chartWidth}
            height={160}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.chartStyle}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chartContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
    alignItems: 'center',
  },
  chartStyle: {
    borderRadius: 16,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    color: '#004d40',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#00796b',
    alignSelf: 'flex-start',
  },
});
