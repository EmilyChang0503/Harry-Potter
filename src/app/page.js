'use client';
import Image from "next/image";
import heroImage from "@/assets/Hogwarts.jpg";
import { useCharacters } from '@/app/context/context';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

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
      <div className="w-full h-[500px] px-0 py-0 relative font-serif">
        <Image
          src={heroImage}
          alt="Harry Potter Hero"
          className="w-full object-cover"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div className="w-[60%] absolute inset-0 flex items-center p-20">
          <div className="bg-white/40 backdrop-blur-sm rounded-lg p-8 shadow-lg">
            <h2 className="text-4xl font-bold mb-4">Explore the World of Harry Potter</h2>
            <p className="text-lg mb-4">
              Discover detailed profiles of your favorite characters from the magical world created by J.K. Rowling.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-16">
        {/* Gender Pie Chart */}
        <div>
          <h3 className="text-lg font-serif mb-2 text-center">Gender Distribution</h3>
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
              </div>
              
              {/* Age Bar Chart */}
              <div>
                <h3 className="text-lg font-serif mb-2 text-center">Age Distribution</h3>
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
              </div>

              {/* House Pie Chart */}
              <div>
                <h3 className="text-lg font-serif mb-2 text-center">House Distribution</h3>
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
        </div>
      </div>
    </div>
  );
}