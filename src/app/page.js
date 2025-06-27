'use client';
import Image from "next/image";
import heroImage from "@/assets/Hogwarts.jpg";
import { useCharacters } from '@/app/context/context';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import LiquidGlass from "liquid-glass-react";

const COLORS = {
  Gryffindor: 'var(--gryffindor)',
  Slytherin: 'var(--slytherin)',
  Ravenclaw: 'var(--ravenclaw)',
  Hufflepuff: 'var(--hufflepuff)',
  default: 'var(--default-house)',
}

function processChartData(characters) {
  const genderMap = {};
  const ageMap = {};
  const houseMap = {};

  characters.forEach((char) => {
    const gender = char.gender || 'Unknown';
    genderMap[gender] = (genderMap[gender] || 0) + 1;

    if (char.house) {
      houseMap[char.house] = (houseMap[char.house] || 0) + 1;
    } else {
      houseMap['No House'] = (houseMap['default'] || 0) + 1;
    }

    if (char.yearOfBirth) {
      const age = 1991 - Number(char.yearOfBirth);
      ageMap[age] = (ageMap[age] || 0) + 1;
    }
  });

  const genderData = Object.entries(genderMap).map(([name, value]) => ({ name, value }));
  const houseData = Object.entries(houseMap).map(([name, value]) => ({ name, value }));
  const ageData = Object.entries(ageMap).map(([age, count]) => ({ age: Number(age), count })).sort((a, b) => a.age - b.age);

  return { genderData, houseData, ageData };
}

export default function HomePage() {
  const { characters, loading, error } = useCharacters();
  const { genderData, houseData, ageData } = processChartData(characters || []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="h-[500px] px-0 py-0 relative font-serif flex items-center justify-center">
        <Image
          src={heroImage}
          alt="Harry Potter Hero"
          className="w-full object-cover"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <LiquidGlass>
        {/* <div className="w-[60%] flex items-center p-20"> */}
          <div className="w-[600px] z-10 bg-white/30 backdrop-blur-sm p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-4">Explore the World of Harry Potter</h2>
            <p className="text-lg mb-4">
              Discover detailed profiles of your favorite characters from the magical world created by J.K. Rowling.
            </p>
          </div>
        {/* </div> */}
        </LiquidGlass>
      </div>

      <div className="flex justify-items-center grid grid-cols-1 md:grid-cols-3 gap-2 mt-16">
        {/* Gender Pie Chart */}
        <Card className="w-[80%] shadow-xl border border-gray-300 bg-white/80 hover:scale-[1.03] transition-transform duration-300">
          <CardContent>
            <CardTitle className="text-lg font-serif mb-2 text-center">Gender Distribution</CardTitle>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  isAnimationActive={true}
                  animationBegin={0}
                  animationDuration={1200}
                >
                {genderData.map((entry, index) => {
                  let color;
                  if (entry.name.toLowerCase() === 'male') {
                    color = COLORS.Ravenclaw;
                  } else if (entry.name.toLowerCase() === 'female') {
                    color = COLORS.Gryffindor;
                  } else {
                    color = COLORS.default;
                  }
                  return <Cell key={`cell-gender-${index}`} fill={color} />;
                })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
              
              {/* Age Bar Chart */}
          <Card className="w-[100%] shadow-xl border border-gray-300 bg-white/80 hover:scale-[1.03] transition-transform duration-300">
            <CardContent>
              <CardTitle className="text-lg font-serif mb-2 text-center">Age Distribution</CardTitle>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ageData} barCategoryGap={4} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age" 
                  label={{ value: 'Age', position: 'insideBottom', fontSize: 12 }} 
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  allowDecimals={false} 
                  label={{ value: 'Number', angle: -90, position: 'insideLeft', offset: 30, fontSize: 12 }} 
                  tick={{ fontSize: 10 }}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationBegin={0}
                />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

              {/* House Pie Chart */}
          <Card className="w-[80%] shadow-xl border border-gray-300 bg-white/80 hover:scale-[1.03] transition-transform duration-300">
            <CardContent>
              <CardTitle className="text-lg font-serif mb-2 text-center">House Distribution</CardTitle>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={houseData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                        isAnimationActive={true}
                        animationBegin={0}
                        animationDuration={1200}
                      >
                        {houseData.map((entry, index) => {
                          const color = COLORS[entry.name] || COLORS.default;
                          return (
                            <Cell key={`cell-house-${index}`} fill={color} />
                          );
                        })}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}