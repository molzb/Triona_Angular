-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2015 at 12:17 AM
-- Server version: 5.5.32
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `triona`
--
CREATE DATABASE IF NOT EXISTS `triona` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `triona`;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE IF NOT EXISTS `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(80) NOT NULL,
  `last_name` varchar(80) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `city` varchar(80) NOT NULL,
  `image` varchar(50) DEFAULT NULL,
  `text` varchar(1500) DEFAULT NULL,
  `password` varchar(64) DEFAULT NULL,
  `email` varchar(80) NOT NULL,
  `role_name` varchar(20) DEFAULT 'employee',
  `jobtitle` varchar(80) NOT NULL,
  `holidays` smallint(6) NOT NULL DEFAULT '25',
  PRIMARY KEY (`id`),
  KEY `LastName` (`last_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `first_name`, `last_name`, `project_id`, `city`, `image`, `text`, `password`, `email`, `role_name`, `jobtitle`, `holidays`) VALUES
(1, 'Holger', 'Klatt', 1, 'Raunheim', 'hk.jpg', 'Holger Klatt, Jahrgang 1960, arbeitete nach dem Studium der Aussenwirtschaft in Berlin als Kaufmann und EDV-Organisator in einem Berliner Außenhandelsbetrieb. Anfang 1990 war er Mitbegründer des Unternehmens Unicorn Project und später Geschäftsführer der BeData GmbH. Ab 1995 arbeitete Holger Klatt als Systems Engineer bei EDS Deutschland (heute HP). Hier sammelte er umfangreiche Erfahrungen im Datenbank-, Client-Server- und Web-Bereich sowie im internationalen Projektgeschäft, u.a. in den USA, Schweden, Belgien und England. Anfang 2001 verließ er EDS und gründete die Triona GmbH zusammen mit seinen beiden Partnern. Im Unternehmen ist Holger Klatt insbesondere für Vertrieb, Entwicklung und Personal zuständig. Hobbies gibt es auch: Familie, Literatur und Tischtennis/Wassersport sowie Digitale Bildverarbeitung teilen sich seine Freizeit. ', '5489bba40c776ceab2f1b87c56dbd3824b808fee', 'holger.klatt@triona.de', 'admin', 'CEO', 25),
(2, 'Igor', 'Chemnitz', 3, '', 'ic.jpg', 'Igor Chemnitz wurde 1967 geboren und wuchs im Großraum Berlin auf. Nach der Ausbildung zum Automatisierungstechniker studierte er zunächst an der heutigen elektrotechnischen Universität in St. Petersburg (Russland) die Automatisierungstechnik. Er setzte sein Studium an der TU Dresden in der Angewandten Informatik fort. Nach dem erfolgreichen Abschluss war er für das GPSystemhaus Mainz als externer Berater tätig. Von 1996 bis 2001 arbeitete er bei EDS Deutschland als Systems Engineer u.a. in internationalen Projekten mit globaler Infrastruktur. Anfang 2001 gründete er mit seinen zwei Partnern die Triona GmbH und ist seit dem als IT-Consultant tätig. Im Unternehmen ist er verantwortlich für Finanzen. Er spielt gern Fussball und fährt noch viel lieber Motorrad.', '8afa2061edc67aa9c8f4b27d39190a83ad48a921', 'igor.chemnitz@triona.de', 'admin', 'Managing Consultant and CEO', 25),
(3, 'Danielle', 'Berg', 8, 'Weißichnichtmehr', 'dk.jpg', 'Danielle Berg kam 1980 in der Nähe von Berlin zur Welt. Während des Studiums der Wirtschaftsinformatik in Berlin war sie u.a. für Design, sowie auch für Implementierung und Wartung des Internetauftritts eines Fachbereichs ihrer Hochschule verantwortlich. Ihre im Studium erworbenen Kenntnisse konnte Danielle zudem in Praktika bei der Dresdner Bank AG unter Beweis stellen und zudem praktische Erfahrungen in der J2EE Welt sammeln. Nach einem einjährigen Aufenthalt in Australien stieß sie 2005 zur Triona GmbH und unterstützt seither deren Kunden als Projektleiter, Architekt und Entwickler bei der Umsetzung von Projekten in unterschiedlichsten Bereichen und Größenordnungen. In der Freizeit stehen ihre gerade vergrößerte Familie, der Sport und ihr großes Interesse für Sprachen im Vordergrund. ', '15f64947a7a4bb14192eff73f89800f7ea70f81b', 'danielle.berg@triona.de', 'employee', 'Senior Consultant', 25),
(4, 'Bernhard', 'Molz', 6, 'Frankfurt', 'bm.jpg', 'Bernhard Molz wurde 1973 in Traben-Trarbach geboren. Anfänglich arbeitete er als Kaufmann, wechselte aber ab dem Jahr 2000 als Java-Entwickler zu einem mittelständischen IT-Dienstleister in Frankfurt. Dort entwickelte er Individualsoftware für Banken, die meist in Form von Applets von den Endkunden der Banken genutzt wurden. Ab 2008 beschäftigte er sich hauptsächlich mit Küchenplaner-Software inkl. 2D- und 3D-Visualisierung und unterstützte die Entwicklung der Webanwendung mhk.net. Seit September 2011 arbeitet Bernhard als JEE Consultant bei der Triona GmbH im Bereich Entwicklung von Enterprise Anwendungen. Seine Freizeit verbringt er gerne mit seiner Familie, mit Radfahren und mit Musik.', '1731e936ec3797f84505b6abd1fcb0b9e969f366', 'bernhard.molz@triona.de', 'admin', 'Lead Consultant', 25),
(5, 'Thomas', 'Wehrspann', 4, 'Hamburg', 'tw.jpg', 'Thomas Wehrspann wurde 1978 in Hamburg geboren. Nach seinem Studium der Wirtschaftsinformatik an der TU Clausthal widmete er sich verschiedenen Projekten, u.a. mit Beiträgen zum Open Source Projekt VDR und erwarb die ITIL v3 Foundation Zertifizierung. Seit 2010 verstärkt Thomas die Triona GmbH als IT Consultant im Bereich Entwicklung und Konzeption. In der Freizeit grillt er gerne mit Familie und Freunden im Garten oder widmet sich seinem Studium der japanischen Sprache. ', '634f6d4accecb9f4ecaace7c3ecc701ba84bcc6d', 'thomas.wehrspann@triona.de', 'employee', 'Consultant', 25),
(6, 'Dawid', 'Tunkel', 7, 'Frankfurt', 'dt.jpg', 'Dawid Tunkel wurde 1986 in Prudnik / Polen geboren und lebt seit seinem dritten Lebensjahr in Deutschland. Er hat sein Studium im Oktober 2011 an der Hochschule Rhein Main in Wiesbaden mit dem Bachelor of Science in Informatik erfolgreich abgeschlossen. Durch diverse Studienprojekte und während seiner Zeit als Werkstudent bei IBM sammelte er Erfahrung in der Softwareentwicklung. Seit April 2012 arbeitet Dawid als IT Consultant bei der Triona GmbH. In seiner Freizeit beschäftigt er sich gerne mit Fußball oder schaut Filme. ', 'af93e29138104be488e89d7f7c07dd6611e0c77b', 'dawid.tunkel@triona.de', 'employee', 'Consultant', 25),
(7, 'Daniel', 'Holderbaum', 1, 'Bad Kreuznach', 'dh.png', 'Daniel Holderbaum wurde 1989 in Bad Kreuznach geboren. Sein Hochschulstudium an der Technischen Universität in Kaiserslautern beendete er im Dezember 2011 als Bachelor of Science in Informatik. Schon während des Studiums sammelte er praktische Erfahrungen im Bereich Web-Entwicklung mit PHP. Im Rahmen seiner Bachelorarbeit am Deutschen Forschungszentrum für Künstliche Intelligenz (DFKI) in Kaiserslautern in der Abteilung Wissensmanagement erweiterte er seine Kenntnisse in Web-Technologien auch im Bereich Java. Daniel ist seit April 2012 als IT Consultant bei der Triona GmbH angestellt. In seiner Freizeit entspannt er sich entweder mit einem guten Film oder Buch, oder misst sich als leidenschaftlicher Computerspieler online mit Gleichgesinnten. ', 'f4aebf3eced2d893a2b35a985571c99b413e5adc', 'daniel.holderbaum@triona.de', 'employee', 'Consultant', 25),
(8, 'Tobias', 'Schmidt', 5, 'Mainz', 'ts.png', 'Tobias Schmidt wurde 1983 in Hachenburg im Westerwald geboren und wohnt mittlerweile im Rhein-Main-Gebiet. Nach seiner Ausbildung und mehrjährigen Tätigkeit als Technischer Zeichner (Fachrichtung Maschinenbau) entschied er sich 2007 für ein Informatik-Masterstudium an der Fachhochschule Bingen, welches er im August 2012 erfolgreich beendete. Während des Studiums konnte Tobias bereits einige Berufserfahrung sammeln, indem er zusätzlich bei einem Grafiksoftwarehersteller als Softwareentwickler arbeitete. Tobias ist seit Oktober 2012 als Java EE Consultant bei der Triona GmbH angestellt. Privat engagiert er sich im CVJM, macht Ausdauersport und liest gerne. ', '0aa304faf22b5721179b4ed22fe17827fdd75e10', 'tobias.schmidt@triona.de', 'employee', 'Consultant', 25),
(9, 'Tobias', 'Lönnies', 4, 'Mainz', 'tl.jpg', 'Tobias Lönnies wurde 1984 in Bremen geboren. Er absolvierte erfolgreich einen der letzten Diplomstudiengänge in Informatik an der Uni Bremen, wobei er sich vor allem mit Themen der künstlichen Intelligenz und des IT-Servicemanagements beschäftigte und in mehreren studentischen Projekten Erfahrung mit der Softwareentwicklung erlangte. Neben dem Informatikstudium schloß er auch ein Studium der Politikwissenschaft mit dem Bachelor ab. Tobias ist seit dem November 2013 bei der Triona GmbH angestellt. In seiner Freizeit liest er gerne und beschäftigt sich auch privat mit Computern. ', '0aa304faf22b5721179b4ed22fe17827fdd75e10', 'tobias.lönnies@triona.de', 'employee', 'Junior Consultant', 25),
(10, 'Sascha', 'Eckert', 1, 'Mainz', 'se.jpg', 'Sascha Eckert, 1985 in Hamburg geboren und derzeit wohnhaft in Darmstadt, beendete seine Ausbildung im Juni 2014. Während der Ausbildung beschäftigte er sich unter anderem sowohl mit der Entwicklung mobiler Applikationen im Android-Umfeld als auch mit Web-Technologien nach aktuellen Standards. Sascha ist seit September 2014 ein Mitarbeiter der Triona GmbH. In seiner Freizeit geht er schwimmen, Salsa tanzen und praktiziert Aikido. ', '64e340364468957953260525113165897aea8047', 'sascha.eckert@triona.de', 'employee', 'Junior Consultant', 25),
(11, 'Mehrnosh', 'Amiri', 2, 'Wiesbaden', 'ma.png', 'Mehrnoosh Amiri wurde 1979 in Teheran geboren. Ihr Informatikstudium an der Heinrich-Heine-Universität Düsseldorf schloss sie als Master of Science ab. Bereits während des Studiums sammelte sie relevante Berufserfahrungen; seither ergänzt sie ihre theoretischen Kenntnisse in der Praxis als Softwareentwicklerin. Mehrnoosh ist seit Oktober 2014 bei der Triona GmbH angestellt. Ihre Freizeit verbringt sie mit ihrer Familie und ihren Freunden, studiert IT-Sicherheit an der Ruhr-Universität Bochum, liest gerne und hört Musik. ', '0bfea410c500508ab070f46da017032a78f5b8e3', 'mehrnosh.amiri@triona.de', 'employee', 'Junior Consultant', 25),
(12, 'Mohamed', 'Berrara', 2, 'Mainz', 'mob.jpg', 'Mohamed Berrada wurde 1982 in Fes / Marokko geboren und kam Anfang 2002 nach Deutschland. Im Februar 2008 absolvierte er erfolgreich den Informatik-Diplomstudiengang an der Hochschule RheinMain in Wiesbaden. In den folgenden Jahren arbeitete Mohamed in verschiedenen Projekten im Logistik-, Bank- und Versicherungsbereich, u.a. in Deutschland, Frankreich und Marokko. Mohamed ist seit Oktober 2014 als Java EE Consultant bei der Triona GmbH angestellt. In seiner Freizeit engagiert er sich für den gemeinnützigen Verein initiative2help und spielt gerne Fußball. ', '840c10b2a101b5a07036e1c53af16e5a1b6428ec', 'mohamed.berrara@triona.de', 'employee', 'Consultant', 25),
(13, 'Michael', 'Rüger', 2, 'Mainz', 'mr.png', 'Michael Rüger wurde 1985 in Crailsheim geboren. Nach dem Besuch des Gymnasiums, inkl. zwei Jahre auf der High School in den USA, begann er mit dem Studiengang Physik mit Nebenfach Informatik. Nach 2 Semestern wechselte er Hauptfach und Nebenfach und vollendete 2014 sein Studium der Diplom Informatik. Während des Studiums sammelte er bei Projekten verschiedener Größe Projekterfahrung und Kenntnisse in Java SE. Michael ist seit Dezember 2014 bei der Triona GmbH beschäftigt. In der Freizeit klettert er wöchentlich in Kletterhallen oder misst sich kompetitiv als begeisteter Computerspieler mit Gleichgesinnten. ', '1749965dc2450045051efb144296aa24f21cf34a', 'michael.rüger@triona.de', 'employee', 'Junior Consultant', 25);

-- --------------------------------------------------------

--
-- Table structure for table `holiday`
--

CREATE TABLE IF NOT EXISTS `holiday` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `working_days` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `holiday`
--

INSERT INTO `holiday` (`id`, `employee_id`, `from_date`, `to_date`, `working_days`) VALUES
(1, 4, '2015-01-02', '2015-01-02', 1),
(2, 4, '2015-02-26', '2015-02-27', 2),
(3, 4, '2015-04-07', '2015-04-14', 6),
(5, 2, '2015-05-04', '2015-11-05', 5);

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client` varchar(80) NOT NULL,
  `project_name` varchar(80) NOT NULL,
  `city` varchar(80) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `icon` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `client`, `project_name`, `city`, `created_at`, `icon`) VALUES
(1, 'Triona', 'FoxController', 'Mainz', '2015-01-19 16:25:42', 'logo_triona.png'),
(2, 'Triona', 'Ausbildung', 'Mainz', '2015-01-19 16:25:42', 'logo_triona.png'),
(3, 'Commerzbank', 'CB-Projekt', 'Frankfurt', '2015-01-19 16:26:46', 'logo_commerzbank.png'),
(4, 'Deutsche Bahn', 'IRIS', 'Frankfurt', '2015-01-19 16:26:46', 'logo_deutschebahn.png'),
(5, 'Deutsche Bahn', 'Wegfinder', 'Frankfurt', '2015-01-19 16:29:06', 'logo_deutschebahn.png'),
(6, 'Deutsche Bank', 'Tradefinder', 'Frankfurt', '2015-01-19 16:29:06', 'logo_deutschebank.gif'),
(7, 'HR', 'Fesad', 'Frankfurt', '2015-01-19 16:29:46', 'logo_hr.gif'),
(8, 'Deutsche Bahn', 'Danielles Projekt', 'Frankfurt', '2015-01-19 16:36:27', 'logo_deutschebahn.png');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
