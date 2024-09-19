import React from "react";
import { Text, View, ScrollView, StyleSheet, Image, FlatList } from "react-native";


const MyanmarZodiacSigns = () => {


    const data = [
        'Eight Planetary Energies',
        'Eight Days of the Week',
        'Eight Cardinal Directions',
        'Eight Burmese Zodiac Animal Signs',
    ];
    const tiger = [
        'Intelligent, intuitive, high alert',
        'An eye for detail',
        'Strong and patient, but only to a point',
        'Dislike being utilized, being wasted time',
        ' Responsible, goal-oriented and ambitious',
    ];
    const lion = [
        'A natural leader, noble person',
        'Self-respect, strong-willed, opinionated',
        'Decisive, challenge willing taker',
    ];
    const elements = [
        'Unpredictable, enthusiastict',
        'Risk-taker',
        'Spontaneous, passionate',
        'Independent, like to be in control of all situations',
    ];
    const elements2 = [
        'Contradictory nature, hard to figure out',
        'Private, detest people meddling in your business',
        'Good at motivating yourself',
        'Certain action taker, successful, achievements accomplished',

    ];
    const rat = [
        'Clever, witty, intelligent',
        'Able to tap into resource and find opportunities',
        'Maybe introverted',
        'Unstoppable',
        'Focused and have a knack for getting ahead',
    ];
    const pig = [
        'Naturally artistic, creative',
        'Have tons of fabulous ideas, but hard to complete',
        'Go in various directions at once',
        'Easily get bored and tired',
        'Loving, kind and sympathetic, sensitive',
    ];
    const dragon = [
        'Philosophical, understanding',
        'Naturally attracted for an easy confidence',
        'Not like depending on others',
    ];

    const gruda = [
        'Kind, generous',
        'Overly gracious',
        'Challenge willing taker',
        'The tougher the obstacle the more motivated you are',
        'Energetic, optimistic, motivative to others',
    ];

    return (
        <FlatList
            data={['staticContent']} // Dummy data to render static content
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.innerContainer}>

                    <View>
                        <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>
                            Myanmar Zodiac Signs (Astrology System)
                        </Text>

                        <View>
                            <Text style={{ marginTop: 10, color: '#ff5455', margin: 10, fontSize: 18, fontWeight: 'bold' }}>
                                History of Myanmar Zodiac Signs
                            </Text>

                            <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                                Burmese zodiac animal signs have their origin from ancient monks of Myanmar.
                                This astrological system is based on the understanding of the cosmic world, which is incorporated with the observations of skies and the wildlife. This astrology branch is called Mahabote, translated to be “little vessel” or “little key” as well.
                                The reason is that it is just a minor branch-off derived from the broader Hindu astrological system.
                                Big things compose of small packages, however, Mahabote is truly a key to extremely powerful insight together with the esoteric realm.
                            </Text>

                            <Image source={require('./assets/circle.png')}
                                style={{ height: 350, width: 350, alignSelf: 'center' }}
                            />
                        </View>

                        <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 50, }}>
                            <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                                Burmese Zodiac Signs
                            </Text>
                        </View>

                        <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                            Burmese astrology absolutely relies on the number eight.
                            Not only it balances the cosmos, but it also reflects the harmony of power and promotes a pleasant atmosphere.
                            Here are the vital elements of Eight in Myanmar astrology:
                        </Text>

                        <View style={{ padding: 16 }}>
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.itemContainer}>
                                        <View style={styles.circle} />
                                        <Text style={styles.text}>{item}</Text>
                                    </View>
                                )}
                                scrollEnabled={false}
                            />
                        </View>


                        <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                            – The ancient Burmese astrological system is based on seven planets, plus Rahu.
                            Rahu is unique for it is a conceptual celestial planet.
                            Theoretically defined, it is the intersection point among the earth, sun and moon at the time of the eclipse.
                            Rahu also serves as an invisible planet of the Burmese zodiac system for astrological purposes.
                            Therefore making the eight planetary entities in the Burmese astrological system.
                        </Text>


                        <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                            – Mahabote is also based on the eight days of the week.
                            For the extra day, Wednesday is split in half in order to make two days: Wednesday morning (12:01 am to 12:00 p.m.)
                            and Wednesday afternoon (12:01 p.m. to 12:00 a.m.).
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                            – Another aspect of this astrological form includes the cardinal directions.
                            As there are eight cardinal directions, each one will move slightly in its distinct symbolic energy.
                            Your direction, which is determined by your day of birth is able to prove beneficial for you.
                            Unlike sun signs, this form of astrology has animal zodiac signs, which are identified by the weekday you were born
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                            Differing from Vietnam zodiac signs which follow the month animals,
                            Burmese zodiac signs follow the weekdays to caculate which animal you are.
                        </Text>

                    </View>

                    <View>
                        <Text style={{ color: '#ff5455', fontWeight: 'bold', margin: 10, fontSize: 18 }}>
                            Burmese Zodiac Animal Signs
                        </Text>

                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                            Zodiac Animal Sign: Lion
                        </Text>


                        <View style={{ margin: 10, flexDirection: 'row' }}>
                            <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                                Day of Week Born
                            </Text>

                            <Text style={{ color: 'gray', fontSize: 16 }}>
                                : Monday
                            </Text>
                        </View>

                        <View style={{ margin: 10, flexDirection: 'row' }}>
                            <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                                Ruling Planet
                            </Text>

                            <Text style={{ color: 'gray', fontSize: 16 }}>
                                : Moon
                            </Text>
                        </View>

                        <View style={{ margin: 10, flexDirection: 'row' }}>
                            <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                                Ruling Direction
                            </Text>

                            <Text style={{ color: 'gray', fontSize: 16 }}>
                                : East
                            </Text>
                        </View>

                        <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                            Personality/Attributes of the Tiger:
                        </Text>



                        <View style={{ padding: 16 }}>
                            <FlatList
                                data={tiger}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.itemContainer}>
                                        <View style={styles.circle} />
                                        <Text style={styles.text}>{item}</Text>
                                    </View>
                                )}
                                scrollEnabled={false}
                            />
                        </View>

                        <Image source={require('./assets/tiger.png')}
                            style={{ height: 230, width: "90%", alignSelf: 'center' }}
                        />

                        <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 40, }}>
                            <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                                Myanmar Animal Zodiac Sign – Tiger (Monday)
                            </Text>
                        </View>
                    </View>





                    <View>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                            Zodiac Animal Sign: Lion
                        </Text>
                    </View>


                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Day of Week Born
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Tuesday
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Planet
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Mars
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Direction
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Southeast
                        </Text>
                    </View>

                    <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                        Personality/Attributes of the Lion:
                    </Text>



                    <View style={{ padding: 16 }}>
                        <FlatList
                            data={lion}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.circle} />
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>



                    <Image source={require('./assets/lion.png')}
                        style={{ height: 230, width: "90%", alignSelf: 'center' }}
                    />


                    <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 40, }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                            Myanmar Animal Zodiac Sign – Lion (Tuesday)
                        </Text>
                    </View>




                    <View>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                            Zodiac Animal Sign: Elephant (with tusks)
                        </Text>
                    </View>


                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Day of Week Born
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Wednesday Morning
                        </Text>
                    </View>


                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Planet
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Mercury
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Direction
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : South
                        </Text>
                    </View>

                    <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                        Personality/Attributes of the Tusked Elephant:
                    </Text>



                    <View style={{ padding: 16 }}>
                        <FlatList
                            data={elements}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.circle} />
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>



                    <Image source={require('./assets/elephent.png')}
                        style={{ height: 230, width: "90%", alignSelf: 'center' }}
                    />

                    <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 50, }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                            Myanmar Animal Zodiac Sign – Elephant (Wednesday Morning)
                        </Text>
                    </View>

                    <View>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                            Zodiac Animal Sign: Elephant (no tusks)
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Day of Week Born
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Wednesday Afternoon
                        </Text>
                    </View>


                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Planet
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Rahu
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Direction
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            :  Northwest
                        </Text>
                    </View>


                    <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                        Personality/Attributes of the Elephant (no tusks):
                    </Text>

                    <View style={{ padding: 16 }}>
                        <FlatList
                            data={elements2}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.circle} />
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>




                    <Image source={require('./assets/tuskless_elephants.png')}
                        style={{ height: 230, width: "90%", alignSelf: 'center' }}
                    />
                    <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 50, }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                            Myanmar Animal Zodiac Sign – Tusk-less Elephant (Wednesday Afternoon)
                        </Text>
                    </View>


                    <View>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                            Zodiac Animal Sign: Rat
                        </Text>
                    </View>


                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Day of Week Born
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Thursday
                        </Text>
                    </View>



                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Planet
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Jupiter
                        </Text>
                    </View>



                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Direction
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : West
                        </Text>
                    </View>

                    <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                        Personality/Attributes of the Rat:
                    </Text>

                    <View style={{ padding: 16 }}>

                        <FlatList
                            data={rat}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.circle} />
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>



                    <Image source={require('./assets/rat.png')}
                        style={{ height: 230, width: "90%", alignSelf: 'center' }}
                    />
                    <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 50, }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                            Myanmar Animal Zodiac Sign – Rat (Thursday)
                        </Text>
                    </View>

                    <View>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                            Zodiac Animal Signs: Guinea Pig
                        </Text>
                    </View>


                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Day of Week Born
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Friday
                        </Text>
                    </View>



                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Planet
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Venus
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Direction
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : North
                        </Text>
                    </View>


                    <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                        Personality/Attributes of the Guinea Pig:
                    </Text>


                    <View style={{ padding: 16 }}>
                        <FlatList
                            data={pig}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.circle} />
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>






                    <Image source={require('./assets/pig.png')}
                        style={{ height: 230, width: "90%", alignSelf: 'center' }}
                    />
                    <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 50, }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                            Myanmar Animal Zodiac Sign – Guinea Pig (Friday)
                        </Text>
                    </View>


                    <View>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                            Zodiac Animal Sign: Dragon
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Day of Week Born
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Saturday
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Planet
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Saturn
                        </Text>
                    </View>


                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Direction
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Southwest
                        </Text>
                    </View>

                    <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                        Personality/Attributes of the Dragon:
                    </Text>

                    <View style={{ padding: 16 }}>
                        <FlatList
                            data={dragon}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.circle} />
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>


                    <Image source={require('./assets/dragon.png')}
                        style={{ height: 230, width: "90%", alignSelf: 'center' }}
                    />

                    <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 50, }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                            Myanmar Animal Zodiac Sign – Dragon (Saturday)
                        </Text>
                    </View>

                    <View>
                        <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                            Zodiac Animal Sign: Garuda (mythical bird, Hindu/Buddhist bird deity)
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Day of Week Born
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Sunday
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Planet
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Sun
                        </Text>
                    </View>

                    <View style={{ margin: 10, flexDirection: 'row' }}>
                        <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
                            Ruling Direction
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16 }}>
                            : Northeast
                        </Text>
                    </View>

                    <Text style={{ color: 'gray', margin: 10, fontSize: 16 }}>
                        Personality/Attributes of the Garuda:
                    </Text>

                    <View style={{ padding: 16 }}>
                        <FlatList
                            data={gruda}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.circle} />
                                    <Text style={styles.text}>{item}</Text>
                                </View>
                            )}
                            scrollEnabled={false}
                        />
                    </View>

                    <Image source={require('./assets/garuda.png')}
                        style={{ height: 230, width: "90%", alignSelf: 'center' }}
                    />

                    <View style={{ backgroundColor: '#0000000d', padding: 8, marginHorizontal: 50, }}>
                        <Text style={{ color: 'black', textAlign: 'center', fontStyle: 'italic' }}>
                            Myanmar Animal Zodiac Sign – Garuda Eagle (Sunday)
                        </Text>
                    </View>


                    <View>
                        <Text style={{ marginTop: 30, color: '#ff5455', margin: 10, fontSize: 20, fontWeight: 'bold' }}>
                            What are Myanmar Zodiac Signs?
                        </Text>
                    </View>

                    <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                        Myanmar Zodiac signs are the traditional astrological system. It was invented by the ancient monks.
                        They created this system by combining their knowledge of the cosmic world and their observations of the skies and the animal kingdom.
                    </Text>

                    <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                        This ancient branch of astrology is called Mahabote. It is translated to mean “little vessel” or “little key”.
                        The meaning is probably because Mahabote is a smaller branch-off from the larger Hindu astrological system.
                    </Text>

                    <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                        Unlike Western astrology, the Myanmar astrology system has only eight zodiac signs. Eight is considered as scared number.
                        It is said the number eight reflects harmony in energy: deflecting imbalance and ever perpetuating congruence.
                    </Text>

                    <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                        There are four essential elements in Myanmar astrology and all of them relate to number eight:
                    </Text>


                    <View>
                        <Text style={{ color: 'gray', fontSize: 16, margin: 5 }}>
                            <Image source={require('./assets/diamond.png')}
                                style={{ height: 15, width: 15, marginTop: 5, tintColor: 'gray' }}
                            />
                            <Text style={{ textDecorationLine: 'underline' }}>Eight Planetary Energies</Text>
                            : the Sun, the Moon, Mercury, Venus, Mars, Jupiter, Saturn and a secret Burmese planet named Rahu.
                        </Text>

                        <Text style={{ color: 'gray', fontSize: 16, margin: 5 }}>
                            Rahu is unique that it is not a planet, but a conceptual celestial presence.
                            Literally defined, Rahu is the point of intersection between the earth, sun and moon at the time of eclipse.
                        </Text>

                    </View>


                    <View style={{ flexDirection: 'row', margin: 5 }}>
                        <Text style={{ color: 'gray', fontSize: 16, }}>
                            <Image source={require('./assets/diamond.png')}
                                style={{ height: 15, width: 15, marginTop: 5, tintColor: 'gray' }}
                            />
                            <Text style={{ textDecorationLine: 'underline' }}>Eight Days of the Week</Text>
                            <Text style={{ color: 'gray', fontSize: 16, margin: 5 }}>
                                In order to have one extra day, the ancient Myanmar monks split Wednesday in half making two days:
                                Wednesday morning (12:01 a.m to 12:00 p.m.) and Wednesday afternoon (12:01 p.m. to 12:00 a.m.).
                            </Text>
                        </Text>
                    </View>



                    <View>
                        <Text style={{ color: 'gray', fontSize: 16, margin: 5 }}>
                            <Image source={require('./assets/diamond.png')}
                                style={{ height: 15, width: 15, marginTop: 5, tintColor: 'gray' }}
                            />
                            <Text style={{ textDecorationLine: 'underline' }}> Eight Cardinal Directions</Text>

                            <Text style={{ color: 'gray', fontSize: 16, margin: 5 }}>
                                : North, South, East, West, Northeast, Northwest, Southeast, and Southwest.
                            </Text >
                        </Text>
                        <Text style={{ marginTop: 20, color: 'gray', fontSize: 16, margin: 5 }}>
                            Each direction vibrates in its own distinct symbolic energy.
                            According to your day of birth, your direction should prove beneficial for you.
                        </Text>
                    </View>


                    <View>
                        <Text style={{ color: 'gray', fontSize: 16, margin: 5 }}>
                            <Image source={require('./assets/diamond.png')}
                                style={{ height: 15, width: 15, marginTop: 5, tintColor: 'gray' }}
                            />
                            <Text style={{ textDecorationLine: 'underline' }}> Eight Burmese Zodiac Animal Signs</Text>
                            <Text style={{ color: 'gray', margin: 5, fontSize: 16 }}>: Elephant with and without tusk, Rat, Garuda, Lion, Tiger, Dragon and Guinea pig.</Text>
                        </Text>
                        <Text style={{ color: 'gray', margin: 5, fontSize: 16 }}>
                            Despite the animals of the zodiac have been existed for thousands of years, people are not clear why these animals were selected.
                            But it is true that the animals are reputed to demonstrate parts of the universe.
                            The animal signs do give a rough idea of the typical traits seen in individuals born under the zodiac sign.
                        </Text>
                    </View>






                    <View>
                        <Text style={{ marginTop: 30, color: '#ff5455', margin: 10, fontSize: 20, fontWeight: 'bold' }}>
                            How is it important in Burmese life?
                        </Text>
                    </View>


                    <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                        The purpose of the Burmese Zodiac Signs Reading is to provide information on the nature and disposition of an individual.
                        This reading is extremely detailed in the information that you are provided. When knowing about the sign, people will be appropriated direction in the life.
                        This helps you to make yourself into a better human being and to know your way of working.
                    </Text>


                    <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                        The Myanmar zodiac signs have very important role in life of Burmese people.
                        Astrology is big business and astrologers are everywhere. Any Burmese people know their sign and use it to get advice from astrologers for every events in life.
                        Astrologers will base on each people’s sign and advise them in naming for their children, deciding an auspicious date for a wedding, starting a business or going to a new job….
                    </Text>

                    <Text style={{ color: 'gray', fontSize: 16, margin: 10 }}>
                        In Burmese temples, there are shrines with the animals symbolizing each day of the week around the base.
                        The people will find the shrines according to the day of birth, donate the flowers and pour water over the Buddha in the shrine. It is believed to provide good luck in the future.
                        In addition, they can go to pray at the direction corresponding to their sign and at other directions depending on the advice of an astrologer.
                    </Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop: 10,
    },
    innerContainer: {
        flex: 1,
    },

    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, // Space between items
    },
    circle: {
        width: 8,
        height: 8,
        borderRadius: 6, // Half of the width and height to make a perfect circle
        backgroundColor: 'gray',
        marginRight: 10, // Space between the circle and text
    },
    text: {
        fontSize: 16,
        color: 'gray',
    },
    // bullet: {
    //     backgroundColor:"black" , // Ensure the bullet is black
    //     fontSize: 25,
    //     tintColor:"black",
    //     overlayColor:"black",
    //     borderBlockColor:"black",
    //     col
    //   },
})




export default MyanmarZodiacSigns;
