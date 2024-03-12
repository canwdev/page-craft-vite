/**
 * https://github.com/ronatskiy/country-flags-svg/blob/master/src/data/countries.ts
 * https://github.com/lipis/flag-icons
 */
function createUrl(svgUrl: string) {
  return `https://upload.wikimedia.org/wikipedia/commons${svgUrl}` as const
}

export const countries = [
  {
    name: 'Afghanistan',
    demonym: 'Afghan',
    flag: createUrl('/5/5c/Flag_of_the_Taliban.svg'),
    iso2: 'AF',
    iso3: 'AFG',
  },
  {
    name: 'Aland Islands',
    demonym: 'Alandic',
    flag: createUrl('/5/52/Flag_of_%C3%85land.svg'),
    iso2: 'AX',
    iso3: 'ALA',
  },
  {
    name: 'Albania',
    demonym: 'Albanian',
    flag: createUrl('/3/36/Flag_of_Albania.svg'),
    iso2: 'AL',
    iso3: 'ALB',
  },
  {
    name: 'Algeria',
    demonym: 'Algerian',
    flag: createUrl('/7/77/Flag_of_Algeria.svg'),
    iso2: 'DZ',
    iso3: 'DZA',
  },
  {
    name: 'American Samoa',
    demonym: 'American Samoan',
    flag: createUrl('/8/87/Flag_of_American_Samoa.svg'),
    iso2: 'AS',
    iso3: 'ASM',
  },
  {
    name: 'Andorra',
    demonym: 'Andorran',
    flag: createUrl('/1/19/Flag_of_Andorra.svg'),
    iso2: 'AD',
    iso3: 'AND',
  },
  {
    name: 'Angola',
    demonym: 'Angolan',
    flag: createUrl('/9/9d/Flag_of_Angola.svg'),
    iso2: 'AO',
    iso3: 'AGO',
  },
  {
    name: 'Anguilla',
    demonym: 'Anguillian',
    flag: createUrl('/b/b4/Flag_of_Anguilla.svg'),
    iso2: 'AI',
    iso3: 'AIA',
  },
  {
    name: 'Antigua and Barbuda',
    demonym: 'Antiguan Barbudan',
    flag: createUrl('/8/89/Flag_of_Antigua_and_Barbuda.svg'),
    iso2: 'AG',
    iso3: 'ATG',
  },
  {
    name: 'Argentina',
    demonym: 'Argentinian',
    flag: createUrl('/1/1a/Flag_of_Argentina.svg'),
    iso2: 'AR',
    iso3: 'ARG',
  },
  {
    name: 'Armenia',
    demonym: 'Armenian',
    flag: createUrl('/2/2f/Flag_of_Armenia.svg'),
    iso2: 'AM',
    iso3: 'ARM',
  },
  {
    name: 'Aruba',
    demonym: 'Arubian',
    flag: createUrl('/f/f6/Flag_of_Aruba.svg'),
    iso2: 'AW',
    iso3: 'ABW',
  },
  {
    name: 'Australia',
    demonym: 'Australian',
    flag: createUrl('/8/88/Flag_of_Australia_(converted).svg'),
    iso2: 'AU',
    iso3: 'AUS',
  },
  {
    name: 'Austria',
    demonym: 'Austrian',
    flag: createUrl('/4/41/Flag_of_Austria.svg'),
    iso2: 'AT',
    iso3: 'AUT',
  },
  {
    name: 'Azerbaijan',
    demonym: 'Azerbaijani',
    flag: createUrl('/d/dd/Flag_of_Azerbaijan.svg'),
    iso2: 'AZ',
    iso3: 'AZE',
  },
  {
    name: 'Bahamas',
    demonym: 'Bahamian',
    flag: createUrl('/9/93/Flag_of_the_Bahamas.svg'),
    iso2: 'BS',
    iso3: 'BHS',
  },
  {
    name: 'Bahrain',
    demonym: 'Bahraini',
    flag: createUrl('/2/2c/Flag_of_Bahrain.svg'),
    iso2: 'BH',
    iso3: 'BHR',
  },
  {
    name: 'Bangladesh',
    demonym: 'Bengali',
    flag: createUrl('/f/f9/Flag_of_Bangladesh.svg'),
    iso2: 'BD',
    iso3: 'BGD',
  },
  {
    name: 'Barbados',
    demonym: 'Barbadian',
    flag: createUrl('/e/ef/Flag_of_Barbados.svg'),
    iso2: 'BB',
    iso3: 'BRB',
  },
  {
    name: 'Belarus',
    demonym: 'Belarusian',
    flag: createUrl('/8/85/Flag_of_Belarus.svg'),
    iso2: 'BY',
    iso3: 'BLR',
  },
  {
    name: 'Belgium',
    demonym: 'Belgian',
    flag: createUrl('/6/65/Flag_of_Belgium.svg'),
    iso2: 'BE',
    iso3: 'BEL',
  },
  {
    name: 'Belize',
    demonym: 'Belizean',
    flag: createUrl('/e/e7/Flag_of_Belize.svg'),
    iso2: 'BZ',
    iso3: 'BLZ',
  },
  {
    name: 'Benin',
    demonym: 'Beninese',
    flag: createUrl('/0/0a/Flag_of_Benin.svg'),
    iso2: 'BJ',
    iso3: 'BEN',
  },
  {
    name: 'Bermuda',
    demonym: 'Bermudian',
    flag: createUrl('/b/bf/Flag_of_Bermuda.svg'),
    iso2: 'BM',
    iso3: 'BMU',
  },
  {
    name: 'Bhutan',
    demonym: 'Bhutanese',
    flag: createUrl('/9/91/Flag_of_Bhutan.svg'),
    iso2: 'BT',
    iso3: 'BTN',
  },
  {
    name: 'Bolivia',
    demonym: 'Bolivian',
    flag: createUrl('/5/5b/Bolivia_Flag.svg'),
    iso2: 'BO',
    iso3: 'BOL',
  },
  {
    name: 'Bonaire, Sint Eustatius and Saba',
    demonym: 'Dutch',
    flag: createUrl('/2/20/Flag_of_the_Netherlands.svg'),
    iso2: 'BQ',
    iso3: 'BES',
  },
  {
    name: 'Bosnia and Herzegovina',
    demonym: 'Bosnian',
    flag: createUrl('/b/bf/Flag_of_Bosnia_and_Herzegovina.svg'),
    iso2: 'BA',
    iso3: 'BIH',
  },
  {
    name: 'Botswana',
    demonym: 'Batswana',
    flag: createUrl('/f/fa/Flag_of_Botswana.svg'),
    iso2: 'BW',
    iso3: 'BWA',
  },
  {
    name: 'Brazil',
    demonym: 'Brazilian',
    flag: createUrl('/0/05/Flag_of_Brazil.svg'),
    iso2: 'BR',
    iso3: 'BRA',
  },
  {
    name: 'British Virgin Islands',
    demonym: 'British Virgin Islander',
    flag: createUrl('/4/42/Flag_of_the_British_Virgin_Islands.svg'),
    iso2: 'VG',
    iso3: 'VGB',
  },
  {
    name: 'Brunei',
    demonym: 'Bruneian',
    flag: createUrl('/9/9c/Flag_of_Brunei.svg'),
    iso2: 'BN',
    iso3: 'BRN',
  },
  {
    name: 'Bulgaria',
    demonym: 'Bulgarian',
    flag: createUrl('/9/9a/Flag_of_Bulgaria.svg'),
    iso2: 'BG',
    iso3: 'BGR',
  },
  {
    name: 'Burkina Faso',
    demonym: 'Burkinabé',
    flag: createUrl('/3/31/Flag_of_Burkina_Faso.svg'),
    iso2: 'BF',
    iso3: 'BFA',
  },
  {
    name: 'Burundi',
    demonym: 'Burundian',
    flag: createUrl('/5/50/Flag_of_Burundi.svg'),
    iso2: 'BI',
    iso3: 'BDI',
  },
  {
    name: 'Cambodia',
    demonym: 'Cambodian',
    flag: createUrl('/8/83/Flag_of_Cambodia.svg'),
    iso2: 'KH',
    iso3: 'KHM',
  },
  {
    name: 'Cameroon',
    demonym: 'Cameroonian',
    flag: createUrl('/4/4f/Flag_of_Cameroon.svg'),
    iso2: 'CM',
    iso3: 'CMR',
  },
  {
    name: 'Canada',
    demonym: 'Canadian',
    flag: createUrl('/d/d9/Flag_of_Canada_(Pantone).svg'),
    iso2: 'CA',
    iso3: 'CAN',
  },
  {
    name: 'Cape Verde',
    demonym: 'Cape Verdean',
    flag: createUrl('/3/38/Flag_of_Cape_Verde.svg'),
    iso2: 'CV',
    iso3: 'CPV',
  },
  {
    name: 'Cayman Islands',
    demonym: 'Caymanian',
    flag: createUrl('/0/0f/Flag_of_the_Cayman_Islands.svg'),
    iso2: 'KY',
    iso3: 'CYM',
  },
  {
    name: 'Central African Republic',
    demonym: 'Central African',
    flag: createUrl('/6/6f/Flag_of_the_Central_African_Republic.svg'),
    iso2: 'CF',
    iso3: 'CAF',
  },
  {
    name: 'Chad',
    demonym: 'Chadian',
    flag: createUrl('/4/4b/Flag_of_Chad.svg'),
    iso2: 'TD',
    iso3: 'TCD',
  },
  {
    name: 'Chile',
    demonym: 'Chilean',
    flag: createUrl('/7/78/Flag_of_Chile.svg'),
    iso2: 'CL',
    iso3: 'CHL',
  },
  {
    name: 'China',
    demonym: 'Chinese',
    flag: createUrl('/f/fa/Flag_of_the_People%27s_Republic_of_China.svg'),
    iso2: 'CN',
    iso3: 'CHN',
  },
  {
    name: 'Christmas Island',
    demonym: 'Christmas Islander',
    flag: createUrl('/6/67/Flag_of_Christmas_Island.svg'),
    iso2: 'CX',
    iso3: 'CXR',
  },
  {
    name: 'Cocos Islands',
    demonym: 'Cocos Islandian',
    flag: createUrl('/7/74/Flag_of_the_Cocos_(Keeling)_Islands.svg'),
    iso2: 'CC',
    iso3: 'CCK',
  },
  {
    name: 'Colombia',
    demonym: 'Colombian',
    flag: createUrl('/2/21/Flag_of_Colombia.svg'),
    iso2: 'CO',
    iso3: 'COL',
  },
  {
    name: 'Comoros',
    demonym: 'Comorian',
    flag: createUrl('/d/df/Flag_of_the_Comoros_(3-2).svg'),
    iso2: 'KM',
    iso3: 'COM',
  },
  {
    name: 'Congo',
    demonym: 'Congolese',
    flag: createUrl('/9/92/Flag_of_the_Republic_of_the_Congo.svg'),
    iso2: 'CG',
    iso3: 'COG',
  },
  {
    name: 'Cook Islands',
    demonym: 'Cook Islander',
    flag: createUrl('/3/35/Flag_of_the_Cook_Islands.svg'),
    iso2: 'CK',
    iso3: 'COK',
  },
  {
    name: 'Costa Rica',
    demonym: 'Costa Rican',
    flag: createUrl('/b/bc/Flag_of_Costa_Rica_(state).svg'),
    iso2: 'CR',
    iso3: 'CRI',
  },
  {
    name: "Côte d'Ivoire",
    demonym: 'Ivorian',
    flag: createUrl('/f/fe/Flag_of_Côte_d%27Ivoire.svg'),
    iso2: 'CI',
    iso3: 'CIV',
  },
  {
    name: 'Croatia',
    demonym: 'Croatian',
    flag: createUrl('/1/1b/Flag_of_Croatia.svg'),
    iso2: 'HR',
    iso3: 'HRV',
  },
  {
    name: 'Cuba',
    demonym: 'Cuban',
    flag: createUrl('/b/bd/Flag_of_Cuba.svg'),
    iso2: 'CU',
    iso3: 'CUB',
  },
  {
    name: 'Curaçao',
    demonym: 'Curaçaoan',
    flag: createUrl('/b/b1/Flag_of_Curaçao.svg'),
    iso2: 'CW',
    iso3: 'CUW',
  },
  {
    name: 'Cyprus',
    demonym: 'Cypriot',
    flag: createUrl('/d/d4/Flag_of_Cyprus.svg'),
    iso2: 'CY',
    iso3: 'CYP',
  },
  {
    name: 'Czech Republic',
    demonym: 'Czech',
    flag: createUrl('/c/cb/Flag_of_the_Czech_Republic.svg'),
    iso2: 'CZ',
    iso3: 'CZE',
  },
  {
    name: 'Democratic Republic of the Congo',
    demonym: 'Democratic Republic Congolese',
    flag: createUrl('/1/11/Flag_of_the_Democratic_Republic_of_the_Congo_(3-2).svg'),
    iso2: 'CD',
    iso3: 'COD',
  },
  {
    name: 'Denmark',
    demonym: 'Danish',
    flag: createUrl('/9/9c/Flag_of_Denmark.svg'),
    iso2: 'DK',
    iso3: 'DNK',
  },
  {
    name: 'Djibouti',
    demonym: 'Djiboutian',
    flag: createUrl('/3/34/Flag_of_Djibouti.svg'),
    iso2: 'DJ',
    iso3: 'DJI',
  },
  {
    name: 'Dominica',
    demonym: 'Dominican',
    flag: createUrl('/c/c4/Flag_of_Dominica.svg'),
    iso2: 'DM',
    iso3: 'DMA',
  },
  {
    name: 'Dominican Republic',
    demonym: 'Dominican Quisqueyan',
    flag: createUrl('/9/9f/Flag_of_the_Dominican_Republic.svg'),
    iso2: 'DO',
    iso3: 'DOM',
  },
  {
    name: 'Ecuador',
    demonym: 'Ecuadorian',
    flag: createUrl('/e/e8/Flag_of_Ecuador.svg'),
    iso2: 'EC',
    iso3: 'ECU',
  },
  {
    name: 'Egypt',
    demonym: 'Egyptian',
    flag: createUrl('/f/fe/Flag_of_Egypt.svg'),
    iso2: 'EG',
    iso3: 'EGY',
  },
  {
    name: 'El Salvador',
    demonym: 'Salvadoran',
    flag: createUrl('/3/34/Flag_of_El_Salvador.svg'),
    iso2: 'SV',
    iso3: 'SLV',
  },
  {
    name: 'Equatorial Guinea',
    demonym: 'Equatoguinean',
    flag: createUrl('/3/31/Flag_of_Equatorial_Guinea.svg'),
    iso2: 'GQ',
    iso3: 'GNQ',
  },
  {
    name: 'Eritrea',
    demonym: 'Eritrean',
    flag: createUrl('/2/29/Flag_of_Eritrea.svg'),
    iso2: 'ER',
    iso3: 'ERI',
  },
  {
    name: 'Estonia',
    demonym: 'Estonian',
    flag: createUrl('/8/8f/Flag_of_Estonia.svg'),
    iso2: 'EE',
    iso3: 'EST',
  },
  {
    name: 'Ethiopia',
    demonym: 'Ethiopian',
    flag: createUrl('/7/71/Flag_of_Ethiopia.svg'),
    iso2: 'ET',
    iso3: 'ETH',
  },
  {
    name: 'Falkland Islands',
    demonym: 'Falkland Islander',
    flag: createUrl('/8/83/Flag_of_the_Falkland_Islands.svg'),
    iso2: 'FK',
    iso3: 'FLK',
  },
  {
    name: 'Faroe Islands',
    demonym: 'Faroese',
    flag: createUrl('/3/3c/Flag_of_the_Faroe_Islands.svg'),
    iso2: 'FO',
    iso3: 'FRO',
  },
  {
    name: 'Fiji',
    demonym: 'Fijian',
    flag: createUrl('/b/ba/Flag_of_Fiji.svg'),
    iso2: 'FJ',
    iso3: 'FJI',
  },
  {
    name: 'Finland',
    demonym: 'Finnish',
    flag: createUrl('/b/bc/Flag_of_Finland.svg'),
    iso2: 'FI',
    iso3: 'FIN',
  },
  {
    name: 'France',
    demonym: 'French',
    flag: createUrl('/c/c3/Flag_of_France.svg'),
    iso2: 'FR',
    iso3: 'FRA',
  },
  {
    name: 'French Guiana',
    demonym: 'Guianan',
    flag: createUrl('/e/ed/Flag_of_France_%28Pantone%29.svg'),
    iso2: 'GF',
    iso3: 'GUF',
  },
  {
    name: 'French Polynesia',
    demonym: 'French Polynesian',
    flag: createUrl('/d/db/Flag_of_French_Polynesia.svg'),
    iso2: 'PF',
    iso3: 'PYF',
  },
  {
    name: 'Gabon',
    demonym: 'Gabonese',
    flag: createUrl('/0/04/Flag_of_Gabon.svg'),
    iso2: 'GA',
    iso3: 'GAB',
  },
  {
    name: 'Gambia',
    demonym: 'Gambian',
    flag: createUrl('/7/77/Flag_of_The_Gambia.svg'),
    iso2: 'GM',
    iso3: 'GMB',
  },
  {
    name: 'Georgia',
    demonym: 'Georgian',
    flag: createUrl('/0/0f/Flag_of_Georgia.svg'),
    iso2: 'GE',
    iso3: 'GEO',
  },
  {
    name: 'Germany',
    demonym: 'German',
    flag: createUrl('/b/ba/Flag_of_Germany.svg'),
    iso2: 'DE',
    iso3: 'DEU',
  },
  {
    name: 'Ghana',
    demonym: 'Ghanaian',
    flag: createUrl('/1/19/Flag_of_Ghana.svg'),
    iso2: 'GH',
    iso3: 'GHA',
  },
  {
    name: 'Gibraltar',
    demonym: 'Gibraltarian',
    flag: createUrl('/0/02/Flag_of_Gibraltar.svg'),
    iso2: 'GI',
    iso3: 'GIB',
  },
  {
    name: 'Greece',
    demonym: 'Greek',
    flag: createUrl('/5/5c/Flag_of_Greece.svg'),
    iso2: 'GR',
    iso3: 'GRC',
  },
  {
    name: 'Greenland',
    demonym: 'Greenlander',
    flag: createUrl('/0/09/Flag_of_Greenland.svg'),
    iso2: 'GL',
    iso3: 'GRL',
  },
  {
    name: 'Grenada',
    demonym: 'Grenadian',
    flag: createUrl('/b/bc/Flag_of_Grenada.svg'),
    iso2: 'GD',
    iso3: 'GRD',
  },
  {
    name: 'Guadeloupe',
    demonym: 'Guadeloupean',
    flag: createUrl('/9/9f/Flag_of_France_%287x10%29.svg'),
    iso2: 'GP',
    iso3: 'GLP',
  },
  {
    name: 'Guam',
    demonym: 'Guamanian',
    flag: createUrl('/0/07/Flag_of_Guam.svg'),
    iso2: 'GU',
    iso3: 'GUM',
  },
  {
    name: 'Guatemala',
    demonym: 'Guatemalan',
    flag: createUrl('/e/ec/Flag_of_Guatemala.svg'),
    iso2: 'GT',
    iso3: 'GTM',
  },
  {
    name: 'Guernsey',
    demonym: 'Guernseymen',
    flag: createUrl('/f/fa/Flag_of_Guernsey.svg'),
    iso2: 'GG',
    iso3: 'GGY',
  },
  {
    name: 'Guinea-Bissau',
    demonym: 'Bissau-Guinean',
    flag: createUrl('/0/01/Flag_of_Guinea-Bissau.svg'),
    iso2: 'GW',
    iso3: 'GNB',
  },
  {
    name: 'Guinea',
    demonym: 'Guinean',
    flag: createUrl('/e/ed/Flag_of_Guinea.svg'),
    iso2: 'GN',
    iso3: 'GIN',
  },
  {
    name: 'Guyana',
    demonym: 'Guyanese',
    flag: createUrl('/9/99/Flag_of_Guyana.svg'),
    iso2: 'GY',
    iso3: 'GUY',
  },
  {
    name: 'Haiti',
    demonym: 'Haitian',
    flag: createUrl('/5/56/Flag_of_Haiti.svg'),
    iso2: 'HT',
    iso3: 'HTI',
  },
  {
    name: 'Holy See',
    demonym: 'Papal',
    flag: createUrl('/0/00/Flag_of_the_Vatican_City.svg'),
    iso2: 'VA',
    iso3: 'VAT',
    altSpellings: ['Vatican'],
  },
  {
    name: 'Honduras',
    demonym: 'Honduran',
    flag: createUrl('/8/82/Flag_of_Honduras.svg'),
    iso2: 'HN',
    iso3: 'HND',
  },
  {
    name: 'Hong Kong',
    demonym: 'Hong Kongese',
    flag: createUrl('/5/5b/Flag_of_Hong_Kong.svg'),
    iso2: 'HK',
    iso3: 'HKG',
  },
  {
    name: 'Hungary',
    demonym: 'Hungarian',
    flag: createUrl('/c/c1/Flag_of_Hungary.svg'),
    iso2: 'HU',
    iso3: 'HUN',
  },
  {
    name: 'Iceland',
    demonym: 'Icelander',
    flag: createUrl('/c/ce/Flag_of_Iceland.svg'),
    iso2: 'IS',
    iso3: 'ISL',
  },
  {
    name: 'India',
    demonym: 'Indian',
    flag: createUrl('/4/41/Flag_of_India.svg'),
    iso2: 'IN',
    iso3: 'IND',
  },
  {
    name: 'Indonesia',
    demonym: 'Indonesian',
    flag: createUrl('/9/9f/Flag_of_Indonesia.svg'),
    iso2: 'ID',
    iso3: 'IDN',
  },
  {
    name: 'British Indian Ocean Territory',
    demonym: 'British Indian Oceanian',
    flag: createUrl('/6/65/Flag_of_the_Commissioner_of_the_British_Indian_Ocean_Territory.svg'),
    iso2: 'IO',
    iso3: 'IOT',
  },
  {
    name: 'Iran',
    demonym: 'Iranian',
    flag: createUrl('/c/ca/Flag_of_Iran.svg'),
    iso2: 'IR',
    iso3: 'IRN',
  },
  {
    name: 'Iraq',
    demonym: 'Iraqi',
    flag: createUrl('/f/f6/Flag_of_Iraq.svg'),
    iso2: 'IQ',
    iso3: 'IRQ',
  },
  {
    name: 'Ireland',
    demonym: 'Irish',
    flag: createUrl('/c/c0/Republic_of_Ireland_Flag.svg'),
    iso2: 'IE',
    iso3: 'IRL',
  },
  {
    name: 'Isle of Man',
    demonym: 'Manx',
    flag: createUrl('/b/bc/Flag_of_the_Isle_of_Man.svg'),
    iso2: 'IM',
    iso3: 'IMN',
  },
  {
    name: 'Israel',
    demonym: 'Israeli',
    flag: createUrl('/d/d4/Flag_of_Israel.svg'),
    iso2: 'IL',
    iso3: 'ISR',
  },
  {
    name: 'Italy',
    demonym: 'Italian',
    flag: createUrl('/0/03/Flag_of_Italy.svg'),
    iso2: 'IT',
    iso3: 'ITA',
  },
  {
    name: 'Jamaica',
    demonym: 'Jamaican',
    flag: createUrl('/0/0a/Flag_of_Jamaica.svg'),
    iso2: 'JM',
    iso3: 'JAM',
  },
  {
    name: 'Japan',
    demonym: 'Japanese',
    flag: createUrl('/b/bc/Flag_of_Japan%28bordered%29.svg'),
    iso2: 'JP',
    iso3: 'JPN',
  },
  {
    name: 'Jersey',
    demonym: 'Jerseyman',
    flag: createUrl('/1/1c/Flag_of_Jersey.svg'),
    iso2: 'JE',
    iso3: 'JEY',
  },
  {
    name: 'Jordan',
    demonym: 'Jordanian',
    flag: createUrl('/c/c0/Flag_of_Jordan.svg'),
    iso2: 'JO',
    iso3: 'JOR',
  },
  {
    name: 'Kazakhstan',
    demonym: 'Kazakhstani',
    flag: createUrl('/d/d3/Flag_of_Kazakhstan.svg'),
    iso2: 'KZ',
    iso3: 'KAZ',
  },
  {
    name: 'Kenya',
    demonym: 'Kenyan',
    flag: createUrl('/4/49/Flag_of_Kenya.svg'),
    iso2: 'KE',
    iso3: 'KEN',
  },
  {
    name: 'Kiribati',
    demonym: 'I-Kiribati',
    flag: createUrl('/d/d3/Flag_of_Kiribati.svg'),
    iso2: 'KI',
    iso3: 'KIR',
  },
  {
    name: 'Kosovo',
    demonym: 'Kosovar',
    flag: createUrl('/1/1f/Flag_of_Kosovo.svg'),
    iso2: 'XK',
    iso3: 'XXK',
  },
  {
    name: 'Kuwait',
    demonym: 'Kuwaiti',
    flag: createUrl('/a/aa/Flag_of_Kuwait.svg'),
    iso2: 'KW',
    iso3: 'KWT',
  },
  {
    name: 'Kyrgyzstan',
    demonym: 'Kyrgyzstani',
    flag: createUrl('/c/c7/Flag_of_Kyrgyzstan.svg'),
    iso2: 'KG',
    iso3: 'KGZ',
  },
  {
    name: 'Laos',
    demonym: 'Lao',
    flag: createUrl('/5/56/Flag_of_Laos.svg'),
    iso2: 'LA',
    iso3: 'LAO',
  },
  {
    name: 'Latvia',
    demonym: 'Latvian',
    flag: createUrl('/8/84/Flag_of_Latvia.svg'),
    iso2: 'LV',
    iso3: 'LVA',
  },
  {
    name: 'Lebanon',
    demonym: 'Lebanese',
    flag: createUrl('/5/59/Flag_of_Lebanon.svg'),
    iso2: 'LB',
    iso3: 'LBN',
  },
  {
    name: 'Lesotho',
    demonym: 'Lesothonian',
    flag: createUrl('/4/4a/Flag_of_Lesotho.svg'),
    iso2: 'LS',
    iso3: 'LSO',
  },
  {
    name: 'Liberia',
    demonym: 'Liberian',
    flag: createUrl('/b/b8/Flag_of_Liberia.svg'),
    iso2: 'LR',
    iso3: 'LBR',
  },
  {
    name: 'Libya',
    demonym: 'Libyan',
    flag: createUrl('/0/05/Flag_of_Libya.svg'),
    iso2: 'LY',
    iso3: 'LBY',
  },
  {
    name: 'Liechtenstein',
    demonym: 'Liechtensteiner',
    flag: createUrl('/4/47/Flag_of_Liechtenstein.svg'),
    iso2: 'LI',
    iso3: 'LIE',
  },
  {
    name: 'Lithuania',
    demonym: 'Lithuanian',
    flag: createUrl('/1/11/Flag_of_Lithuania.svg'),
    iso2: 'LT',
    iso3: 'LTU',
  },
  {
    name: 'Luxembourg',
    demonym: 'Luxembourgish',
    flag: createUrl('/d/da/Flag_of_Luxembourg.svg'),
    iso2: 'LU',
    iso3: 'LUX',
  },
  {
    name: 'Macao',
    demonym: 'Macau',
    flag: createUrl('/6/63/Flag_of_Macau.svg'),
    iso2: 'MO',
    iso3: 'MAC',
  },
  {
    name: 'Madagascar',
    demonym: 'Malagasy',
    flag: createUrl('/b/bc/Flag_of_Madagascar.svg'),
    iso2: 'MG',
    iso3: 'MDG',
  },
  {
    name: 'Malawi',
    demonym: 'Malawian',
    flag: createUrl('/d/d1/Flag_of_Malawi.svg'),
    iso2: 'MW',
    iso3: 'MWI',
  },
  {
    name: 'Malaysia',
    demonym: 'Malaysian',
    flag: createUrl('/6/66/Flag_of_Malaysia.svg'),
    iso2: 'MY',
    iso3: 'MYS',
  },
  {
    name: 'Maldives',
    demonym: 'Maldivian',
    flag: createUrl('/0/0f/Flag_of_Maldives.svg'),
    iso2: 'MV',
    iso3: 'MDV',
  },
  {
    name: 'Mali',
    demonym: 'Malian',
    flag: createUrl('/9/92/Flag_of_Mali.svg'),
    iso2: 'ML',
    iso3: 'MLI',
  },
  {
    name: 'Malta',
    demonym: 'Maltese',
    flag: createUrl('/7/73/Flag_of_Malta.svg'),
    iso2: 'MT',
    iso3: 'MLT',
  },
  {
    name: 'Marshall Islands',
    demonym: 'Marshallese',
    flag: createUrl('/2/2e/Flag_of_the_Marshall_Islands.svg'),
    iso2: 'MH',
    iso3: 'MHL',
  },
  {
    name: 'Martinique',
    demonym: 'Martinican',
    flag: createUrl('/2/21/Flag_of_the_Territorial_Collectivity_of_Martinique.svg'),
    iso2: 'MQ',
    iso3: 'MTQ',
  },
  {
    name: 'Mauritania',
    demonym: 'Mauritanian',
    flag: createUrl('/4/43/Flag_of_Mauritania.svg'),
    iso2: 'MR',
    iso3: 'MRT',
  },
  {
    name: 'Mauritius',
    demonym: 'Mauritian',
    flag: createUrl('/7/77/Flag_of_Mauritius.svg'),
    iso2: 'MU',
    iso3: 'MUS',
  },
  {
    name: 'Mayotte',
    demonym: 'Mahoran',
    flag: createUrl('/c/c3/Flag_of_France.svg'),
    iso2: 'YT',
    iso3: 'MYT',
  },
  {
    name: 'Mexico',
    demonym: 'Mexican',
    flag: createUrl('/f/fc/Flag_of_Mexico.svg'),
    iso2: 'MX',
    iso3: 'MEX',
  },
  {
    name: 'Micronesia',
    demonym: 'Micronesian',
    flag: createUrl('/e/e4/Flag_of_the_Federated_States_of_Micronesia.svg'),
    iso2: 'FM',
    iso3: 'FSM',
  },
  {
    name: 'Moldova',
    demonym: 'Moldovan',
    flag: createUrl('/2/27/Flag_of_Moldova.svg'),
    iso2: 'MD',
    iso3: 'MDA',
  },
  {
    name: 'Monaco',
    demonym: 'Monegasque',
    flag: createUrl('/e/ea/Flag_of_Monaco.svg'),
    iso2: 'MC',
    iso3: 'MCO',
  },
  {
    name: 'Mongolia',
    demonym: 'Mongolian',
    flag: createUrl('/4/4c/Flag_of_Mongolia.svg'),
    iso2: 'MN',
    iso3: 'MNG',
  },
  {
    name: 'Montenegro',
    demonym: 'Montenegrin',
    flag: createUrl('/6/64/Flag_of_Montenegro.svg'),
    iso2: 'ME',
    iso3: 'MNE',
  },
  {
    name: 'Montserrat',
    demonym: 'Montserratian',
    flag: createUrl('/d/d0/Flag_of_Montserrat.svg'),
    iso2: 'MS',
    iso3: 'MSR',
  },
  {
    name: 'Morocco',
    demonym: 'Moroccan',
    flag: createUrl('/2/2c/Flag_of_Morocco.svg'),
    iso2: 'MA',
    iso3: 'MAR',
  },
  {
    name: 'Mozambique',
    demonym: 'Mozambican',
    flag: createUrl('/d/d0/Flag_of_Mozambique.svg'),
    iso2: 'MZ',
    iso3: 'MOZ',
  },
  {
    name: 'Myanmar',
    demonym: 'Myanma',
    flag: createUrl('/8/8c/Flag_of_Myanmar.svg'),
    iso2: 'MM',
    iso3: 'MMR',
  },
  {
    name: 'Namibia',
    demonym: 'Namibian',
    flag: createUrl('/0/00/Flag_of_Namibia.svg'),
    iso2: 'NA',
    iso3: 'NAM',
  },
  {
    name: 'Nauru',
    demonym: 'Nauruan',
    flag: createUrl('/3/30/Flag_of_Nauru.svg'),
    iso2: 'NR',
    iso3: 'NRU',
  },
  {
    name: 'Nepal',
    demonym: 'Nepalese',
    flag: createUrl('/9/9b/Flag_of_Nepal.svg'),
    iso2: 'NP',
    iso3: 'NPL',
  },
  {
    name: 'Netherlands Antilles',
    demonym: 'Netherlands Antillean',
    flag: createUrl('/e/eb/Flag_of_the_Netherlands_Antilles_(1959%E2%80%931986).svg'),
    iso2: 'AN',
    iso3: 'ANT',
  },
  {
    name: 'Netherlands',
    demonym: 'Dutch',
    flag: createUrl('/2/20/Flag_of_the_Netherlands.svg'),
    iso2: 'NL',
    iso3: 'NLD',
  },
  {
    name: 'New Caledonia',
    demonym: 'New Caledonian',
    flag: createUrl('/6/66/Flag_of_FLNKS.svg'),
    iso2: 'NC',
    iso3: 'NCL',
  },
  {
    name: 'New Zealand',
    demonym: 'New Zealander',
    flag: createUrl('/3/3e/Flag_of_New_Zealand.svg'),
    iso2: 'NZ',
    iso3: 'NZL',
  },
  {
    name: 'Nicaragua',
    demonym: 'Nicaraguan',
    flag: createUrl('/1/19/Flag_of_Nicaragua.svg'),
    iso2: 'NI',
    iso3: 'NIC',
  },
  {
    name: 'Niger',
    demonym: 'Nigerien',
    flag: createUrl('/f/f4/Flag_of_Niger.svg'),
    iso2: 'NE',
    iso3: 'NER',
  },
  {
    name: 'Nigeria',
    demonym: 'Nigerian',
    flag: createUrl('/7/79/Flag_of_Nigeria.svg'),
    iso2: 'NG',
    iso3: 'NGA',
  },
  {
    name: 'Niue',
    demonym: 'Niuean',
    flag: createUrl('/0/01/Flag_of_Niue.svg'),
    iso2: 'NU',
    iso3: 'NIU',
  },
  {
    name: 'Norfolk Island',
    demonym: 'Norfolk Islander',
    flag: createUrl('/4/48/Flag_of_Norfolk_Island.svg'),
    iso2: 'NF',
    iso3: 'NFK',
  },
  {
    name: 'North Korea',
    demonym: 'North Korea',
    flag: createUrl('/5/51/Flag_of_North_Korea.svg'),
    iso2: 'KP',
    iso3: 'PRK',
  },
  {
    name: 'North Macedonia',
    demonym: 'Macedonian',
    flag: createUrl('/7/79/Flag_of_North_Macedonia.svg'),
    iso2: 'MK',
    iso3: 'MKD',
  },
  {
    name: 'Northern Mariana Islands',
    demonym: 'Northern Mariana Islander',
    flag: createUrl('/e/e0/Flag_of_the_Northern_Mariana_Islands.svg'),
    iso2: 'MP',
    iso3: 'MNP',
  },
  {
    name: 'Norway',
    demonym: 'Norwegian',
    flag: createUrl('/d/d9/Flag_of_Norway.svg'),
    iso2: 'NO',
    iso3: 'NOR',
  },
  {
    name: 'Oman',
    demonym: 'Omani',
    flag: createUrl('/d/dd/Flag_of_Oman.svg'),
    iso2: 'OM',
    iso3: 'OMN',
  },
  {
    name: 'Pakistan',
    demonym: 'Pakistani',
    flag: createUrl('/3/32/Flag_of_Pakistan.svg'),
    iso2: 'PK',
    iso3: 'PAK',
  },
  {
    name: 'Palau',
    demonym: 'Palauan',
    flag: createUrl('/4/48/Flag_of_Palau.svg'),
    iso2: 'PW',
    iso3: 'PLW',
  },
  {
    name: 'Palestine',
    demonym: 'Palestinian',
    flag: createUrl('/f/f4/Palestine_Flag.svg'),
    iso2: 'PS',
    iso3: 'PSE',
  },
  {
    name: 'Panama',
    demonym: 'Panamanian',
    flag: createUrl('/a/ab/Flag_of_Panama.svg'),
    iso2: 'PA',
    iso3: 'PAN',
  },
  {
    name: 'Papua New Guinea',
    demonym: 'Papua New Guinean',
    flag: createUrl('/e/e3/Flag_of_Papua_New_Guinea.svg'),
    iso2: 'PG',
    iso3: 'PNG',
  },
  {
    name: 'Paraguay',
    demonym: 'Paraguayan',
    flag: createUrl('/2/27/Flag_of_Paraguay.svg'),
    iso2: 'PY',
    iso3: 'PRY',
  },
  {
    name: 'Peru',
    demonym: 'Peruvian',
    flag: createUrl('/c/cf/Flag_of_Peru.svg'),
    iso2: 'PE',
    iso3: 'PER',
  },
  {
    name: 'Philippines',
    demonym: 'Filipino',
    flag: createUrl('/9/99/Flag_of_the_Philippines.svg'),
    iso2: 'PH',
    iso3: 'PHL',
  },
  {
    name: 'Pitcairn',
    demonym: 'Pitcairn Islander',
    flag: createUrl('/8/88/Flag_of_the_Pitcairn_Islands.svg'),
    iso2: 'PN',
    iso3: 'PCN',
  },
  {
    name: 'Poland',
    demonym: 'Polish',
    flag: createUrl('/1/12/Flag_of_Poland.svg'),
    iso2: 'PL',
    iso3: 'POL',
  },
  {
    name: 'Portugal',
    demonym: 'Portuguese',
    flag: createUrl('/5/5c/Flag_of_Portugal.svg'),
    iso2: 'PT',
    iso3: 'PRT',
  },
  {
    name: 'Puerto Rico',
    demonym: 'Puerto Rican',
    flag: createUrl('/2/28/Flag_of_Puerto_Rico.svg'),
    iso2: 'PR',
    iso3: 'PRI',
  },
  {
    name: 'Qatar',
    demonym: 'Qatari',
    flag: createUrl('/6/65/Flag_of_Qatar.svg'),
    iso2: 'QA',
    iso3: 'QAT',
  },
  {
    name: 'Réunion',
    demonym: 'Réunionese',
    flag: createUrl('/5/5a/Flag_of_Réunion.svg'),
    iso2: 'RE',
    iso3: 'REU',
  },
  {
    name: 'Romania',
    demonym: 'Romanian',
    flag: createUrl('/7/73/Flag_of_Romania.svg'),
    iso2: 'RO',
    iso3: 'ROU',
  },
  {
    name: 'Russia',
    demonym: 'Russian',
    flag: createUrl('/f/f3/Flag_of_Russia.svg'),
    iso2: 'RU',
    iso3: 'RUS',
  },
  {
    name: 'Rwanda',
    demonym: 'Rwandan',
    flag: createUrl('/1/17/Flag_of_Rwanda.svg'),
    iso2: 'RW',
    iso3: 'RWA',
  },
  {
    name: 'Saint Barthélemy',
    demonym: 'Barthélemois',
    flag: createUrl('/0/03/Saint-Barthelémy_Icône.svg'),
    iso2: 'BL',
    iso3: 'BLM',
  },
  {
    name: 'Saint Helena, Ascension and Tristan da Cunha',
    demonym: 'Ascensionian',
    flag: createUrl('/0/00/Flag_of_Saint_Helena.svg'),
    iso2: 'SH',
    iso3: 'SHN',
    altSpellings: ['Saint Helenian', 'Tristanian'],
  },
  {
    name: 'Saint Kitts and Nevis',
    demonym: 'Kittitian',
    flag: createUrl('/f/fe/Flag_of_Saint_Kitts_and_Nevis.svg'),
    iso2: 'KN',
    iso3: 'KNA',
    altSpellings: ['Nevisian'],
  },
  {
    name: 'Saint Lucia',
    demonym: 'Saint Lucian',
    flag: createUrl('/9/9f/Flag_of_Saint_Lucia.svg'),
    iso2: 'LC',
    iso3: 'LCA',
  },
  {
    name: 'Saint Martin',
    demonym: 'Saint-Martinois',
    flag: createUrl('/d/dd/Flag_of_Saint-Martin_%28fictional%29.svg'),
    iso2: 'MF',
    iso3: 'MAF',
  },
  {
    name: 'Saint Pierre and Miquelon',
    demonym: 'Saint-Pierrais',
    flag: createUrl('/7/74/Flag_of_Saint-Pierre_and_Miquelon.svg'),
    iso2: 'PM',
    iso3: 'SPM',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    demonym: 'Saint Vincentian',
    flag: createUrl('/6/6d/Flag_of_Saint_Vincent_and_the_Grenadines.svg'),
    iso2: 'VC',
    iso3: 'VCT',
  },
  {
    name: 'Samoa',
    demonym: 'Samoan',
    flag: createUrl('/3/31/Flag_of_Samoa.svg'),
    iso2: 'WS',
    iso3: 'WSM',
  },
  {
    name: 'San Marino',
    demonym: 'Sammarinese',
    flag: createUrl('/b/b1/Flag_of_San_Marino.svg'),
    iso2: 'SM',
    iso3: 'SMR',
  },
  {
    name: 'Sao Tome and Principe',
    demonym: 'São Toméan',
    flag: createUrl('/4/4f/Flag_of_Sao_Tome_and_Principe.svg'),
    iso2: 'ST',
    iso3: 'STP',
  },
  {
    name: 'Saudi Arabia',
    demonym: 'Saudi',
    flag: createUrl('/0/0d/Flag_of_Saudi_Arabia.svg'),
    iso2: 'SA',
    iso3: 'SAU',
  },
  {
    name: 'Senegal',
    demonym: 'Senegalese',
    flag: createUrl('/f/fd/Flag_of_Senegal.svg'),
    iso2: 'SN',
    iso3: 'SEN',
  },
  {
    name: 'Serbia',
    demonym: 'Serbian',
    flag: createUrl('/f/ff/Flag_of_Serbia.svg'),
    iso2: 'RS',
    iso3: 'SRB',
  },
  {
    name: 'Seychelles',
    demonym: 'Seychellois',
    flag: createUrl('/f/fc/Flag_of_Seychelles.svg'),
    iso2: 'SC',
    iso3: 'SYC',
  },
  {
    name: 'Sierra Leone',
    demonym: 'Sierra Leonean',
    flag: createUrl('/1/17/Flag_of_Sierra_Leone.svg'),
    iso2: 'SL',
    iso3: 'SLE',
  },
  {
    name: 'Singapore',
    demonym: 'Singaporean',
    flag: createUrl('/4/48/Flag_of_Singapore.svg'),
    iso2: 'SG',
    iso3: 'SGP',
    altSpellings: ['SG', 'Singapura', 'Republik Singapura'],
  },
  {
    name: 'Sint Maarten',
    demonym: 'St. Maartener',
    flag: createUrl('/d/d3/Flag_of_Sint_Maarten.svg'),
    iso2: 'SX',
    iso3: 'SXM',
  },
  {
    name: 'Slovakia',
    demonym: 'Slovak',
    flag: createUrl('/e/e6/Flag_of_Slovakia.svg'),
    iso2: 'SK',
    iso3: 'SVK',
  },
  {
    name: 'Slovenia',
    demonym: 'Slovenian',
    flag: createUrl('/f/f0/Flag_of_Slovenia.svg'),
    iso2: 'SI',
    iso3: 'SVN',
  },
  {
    name: 'Solomon Islands',
    demonym: 'Solomon Islander',
    flag: createUrl('/7/74/Flag_of_the_Solomon_Islands.svg'),
    iso2: 'SB',
    iso3: 'SLB',
  },
  {
    name: 'Somalia',
    demonym: 'Somali',
    flag: createUrl('/a/a0/Flag_of_Somalia.svg'),
    iso2: 'SO',
    iso3: 'SOM',
  },
  {
    name: 'South Africa',
    demonym: 'South African',
    flag: createUrl('/a/af/Flag_of_South_Africa.svg'),
    iso2: 'ZA',
    iso3: 'ZAF',
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    demonym: 'South Georgian',
    flag: createUrl('/e/ed/Flag_of_South_Georgia_and_the_South_Sandwich_Islands.svg'),
    iso2: 'GS',
    iso3: 'SGS',
  },
  {
    name: 'South Korea',
    demonym: 'South Korean',
    flag: createUrl('/0/09/Flag_of_South_Korea.svg'),
    iso2: 'KR',
    iso3: 'KOR',
    altSpellings: ['Republic of Korea'],
  },
  {
    name: 'South Sudan',
    demonym: 'South Sudanese',
    flag: createUrl('/7/7a/Flag_of_South_Sudan.svg'),
    iso2: 'SS',
    iso3: 'SSD',
  },
  {
    name: 'Spain',
    demonym: 'Spanish',
    flag: createUrl('/9/9a/Flag_of_Spain.svg'),
    iso2: 'ES',
    iso3: 'ESP',
  },
  {
    name: 'Sri Lanka',
    demonym: 'Sri Lankan',
    flag: createUrl('/1/11/Flag_of_Sri_Lanka.svg'),
    iso2: 'LK',
    iso3: 'LKA',
  },
  {
    name: 'Sudan',
    demonym: 'Sudanese',
    flag: createUrl('/0/01/Flag_of_Sudan.svg'),
    iso2: 'SD',
    iso3: 'SDN',
  },
  {
    name: 'Suriname',
    demonym: 'Surinamese',
    flag: createUrl('/6/60/Flag_of_Suriname.svg'),
    iso2: 'SR',
    iso3: 'SUR',
  },
  {
    name: 'Svalbard and Jan Mayen',
    demonym: 'Svalbard',
    flag: createUrl('/d/d9/Flag_of_Norway.svg'),
    iso2: 'SJ',
    iso3: 'SJM',
  },
  {
    name: 'Swaziland',
    demonym: 'Swazi',
    flag: createUrl('/f/fb/Flag_of_Eswatini.svg'),
    iso2: 'SZ',
    iso3: 'SWZ',
  },
  {
    name: 'Sweden',
    demonym: 'Swedish',
    flag: createUrl('/4/4c/Flag_of_Sweden.svg'),
    iso2: 'SE',
    iso3: 'SWE',
  },
  {
    name: 'Switzerland',
    demonym: 'Swiss',
    flag: createUrl('/f/f3/Flag_of_Switzerland.svg'),
    iso2: 'CH',
    iso3: 'CHE',
  },
  {
    name: 'Syria',
    demonym: 'Syrian',
    flag: createUrl('/5/53/Flag_of_Syria.svg'),
    iso2: 'SY',
    iso3: 'SYR',
  },
  {
    name: 'Taiwan',
    demonym: 'Taiwanese',
    // flag: createUrl('/7/72/Flag_of_the_Republic_of_China.svg'),
    iso2: 'TW',
    iso3: 'TWN',
  },
  {
    name: 'Tajikistan',
    demonym: 'Tajik',
    flag: createUrl('/d/d0/Flag_of_Tajikistan.svg'),
    iso2: 'TJ',
    iso3: 'TJK',
  },
  {
    name: 'Tanzania',
    demonym: 'Tanzanian',
    flag: createUrl('/3/38/Flag_of_Tanzania.svg'),
    iso2: 'TZ',
    iso3: 'TZA',
  },
  {
    name: 'Thailand',
    demonym: 'Thai',
    flag: createUrl('/a/a9/Flag_of_Thailand.svg'),
    iso2: 'TH',
    iso3: 'THA',
  },
  {
    name: 'Timor-Leste',
    demonym: 'Timorese',
    flag: createUrl('/2/26/Flag_of_East_Timor.svg'),
    iso2: 'TL',
    iso3: 'TLS',
  },
  {
    name: 'Togo',
    demonym: 'Togolese',
    flag: createUrl('/6/68/Flag_of_Togo.svg'),
    iso2: 'TG',
    iso3: 'TGO',
  },
  {
    name: 'Tokelau',
    demonym: 'Tokelauan',
    flag: createUrl('/8/8e/Flag_of_Tokelau.svg'),
    iso2: 'TK',
    iso3: 'TKL',
  },
  {
    name: 'Tonga',
    demonym: 'Tongan',
    flag: createUrl('/9/9a/Flag_of_Tonga.svg'),
    iso2: 'TO',
    iso3: 'TON',
  },
  {
    name: 'Trinidad and Tobago',
    demonym: 'Trinidadian and Tobagonian',
    flag: createUrl('/6/64/Flag_of_Trinidad_and_Tobago.svg'),
    iso2: 'TT',
    iso3: 'TTO',
  },
  {
    name: 'Tunisia',
    demonym: 'Tunisian',
    flag: createUrl('/c/ce/Flag_of_Tunisia.svg'),
    iso2: 'TN',
    iso3: 'TUN',
  },
  {
    name: 'Turkey',
    demonym: 'Turkish',
    flag: createUrl('/b/b4/Flag_of_Turkey.svg'),
    iso2: 'TR',
    iso3: 'TUR',
  },
  {
    name: 'Turkmenistan',
    demonym: 'Turkmenistani',
    flag: createUrl('/1/1b/Flag_of_Turkmenistan.svg'),
    iso2: 'TM',
    iso3: 'TKM',
  },
  {
    name: 'Turks and Caicos Islands',
    demonym: 'Turks and Caicos Islander',
    flag: createUrl('/a/a0/Flag_of_the_Turks_and_Caicos_Islands.svg'),
    iso2: 'TC',
    iso3: 'TCA',
  },
  {
    name: 'Tuvalu',
    demonym: 'Tuvaluan',
    flag: createUrl('/3/38/Flag_of_Tuvalu.svg'),
    iso2: 'TV',
    iso3: 'TUV',
  },
  {
    name: 'Uganda',
    demonym: 'Ugandan',
    flag: createUrl('/4/4e/Flag_of_Uganda.svg'),
    iso2: 'UG',
    iso3: 'UGA',
  },
  {
    name: 'Ukraine',
    demonym: 'Ukrainian',
    flag: createUrl('/4/49/Flag_of_Ukraine.svg'),
    iso2: 'UA',
    iso3: 'UKR',
  },
  {
    name: 'United Arab Emirates',
    demonym: 'Emirati',
    flag: createUrl('/c/cb/Flag_of_the_United_Arab_Emirates.svg'),
    iso2: 'AE',
    iso3: 'ARE',
    altSpellings: ['AE', 'UAE'],
  },
  {
    name: 'United Kingdom',
    demonym: 'British',
    flag: createUrl('/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg'),
    iso2: 'GB',
    iso3: 'GBR',
    altSpellings: ['UK'],
  },
  {
    name: 'United States Minor Outlying Islands',
    demonym: 'American Islander',
    flag: createUrl('/0/05/Flag_of_the_U.S..svg'),
    iso2: 'UM',
    iso3: 'UMI',
  },
  {
    name: 'United States',
    demonym: 'American',
    flag: createUrl('/a/a4/Flag_of_the_United_States.svg'),
    iso2: 'US',
    iso3: 'USA',
    altSpellings: ['USA'],
  },
  {
    name: 'Uruguay',
    demonym: 'Uruguayan',
    flag: createUrl('/f/fe/Flag_of_Uruguay.svg'),
    iso2: 'UY',
    iso3: 'URY',
  },
  {
    name: 'Uzbekistan',
    demonym: 'Uzbek',
    flag: createUrl('/8/84/Flag_of_Uzbekistan.svg'),
    iso2: 'UZ',
    iso3: 'UZB',
  },
  {
    name: 'Vanuatu',
    demonym: 'Vanuatuan',
    flag: createUrl('/6/6e/Flag_of_Vanuatu_(official).svg'),
    iso2: 'VU',
    iso3: 'VUT',
  },
  {
    name: 'Venezuela',
    demonym: 'Venezuelan',
    flag: createUrl('/7/7b/Flag_of_Venezuela_(state).svg'),
    iso2: 'VE',
    iso3: 'VEN',
  },
  {
    name: 'Vietnam',
    demonym: 'Vietnamese',
    flag: createUrl('/2/21/Flag_of_Vietnam.svg'),
    iso2: 'VN',
    iso3: 'VNM',
    altSpellings: ['Viet Nam', 'Republic of Viet Nam', 'South Vietnam'],
  },
  {
    name: 'Virgin Islands of the United States',
    demonym: 'American Virgin Islander',
    flag: createUrl('/f/f8/Flag_of_the_United_States_Virgin_Islands.svg'),
    iso2: 'VI',
    iso3: 'VIR',
  },
  {
    name: 'Wallis and Futuna',
    demonym: 'Wallisian',
    flag: createUrl('/d/d2/Flag_of_Wallis_and_Futuna.svg'),
    iso2: 'WF',
    iso3: 'WLF',
    altSpellings: ['Futunan'],
  },
  {
    name: 'Western Sahara',
    demonym: 'Western Saharan',
    flag: createUrl('/2/26/Flag_of_the_Sahrawi_Arab_Democratic_Republic.svg'),
    iso2: 'EH',
    iso3: 'ESH',
  },
  {
    name: 'Yemen',
    demonym: 'Yemeni',
    flag: createUrl('/8/89/Flag_of_Yemen.svg'),
    iso2: 'YE',
    iso3: 'YEM',
  },
  {
    name: 'Zambia',
    demonym: 'Zambian',
    flag: createUrl('/0/06/Flag_of_Zambia.svg'),
    iso2: 'ZM',
    iso3: 'ZMB',
  },
  {
    name: 'Zimbabwe',
    demonym: 'Zimbabwean',
    flag: createUrl('/6/6a/Flag_of_Zimbabwe.svg'),
    iso2: 'ZW',
    iso3: 'ZWE',
  },
] as const
