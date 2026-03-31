-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 31, 2026 at 11:35 AM
-- Server version: 8.0.45
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cms_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `Client`
--

CREATE TABLE `Client` (
  `id` int NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `project_no` varchar(255) DEFAULT NULL,
  `labour_contractor` varchar(255) DEFAULT NULL,
  `address` text,
  `total_budget` varchar(255) DEFAULT NULL,
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Client`
--

INSERT INTO `Client` (`id`, `client_name`, `project_no`, `labour_contractor`, `address`, `total_budget`, `created_on`) VALUES
(1, 'Mr. Rajesh Kumar', '#MC001', 'Suresh Construction', 'Whitefield, Bangalore', '1500000', '2026-03-22 15:40:19'),
(2, 'Mrs. Priya Sharma', '#MC002', 'Ramesh Builders', 'Electronic City, Bangalore', '1800000', '2026-03-22 15:40:19'),
(3, 'Mr. Anil Reddy', '#MC003', 'Krishna Constructions', 'Hosur Road, Bangalore', '1700000', '2026-03-22 15:40:19'),
(4, 'vittesh', '#2', 'cvcvcv', 'asas', '₹ 18,00,000', '2026-03-25 06:14:29');

-- --------------------------------------------------------

--
-- Table structure for table `DailyReport`
--

CREATE TABLE `DailyReport` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `material_id` int DEFAULT NULL,
  `material_dr_number` varchar(255) DEFAULT NULL,
  `particulars` text,
  `date` date DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `paid` decimal(15,2) DEFAULT NULL,
  `balance` decimal(15,2) DEFAULT NULL,
  `units` varchar(255) DEFAULT NULL,
  `quantity` decimal(15,2) DEFAULT NULL,
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DailyReport`
--

INSERT INTO `DailyReport` (`id`, `project_id`, `material_id`, `material_dr_number`, `particulars`, `date`, `amount`, `paid`, `balance`, `units`, `quantity`, `remarks`) VALUES
(1, 1, 1, 'DR001', 'Steel', '2026-03-17', 50000.00, 30000.00, 20000.00, 'kg', 100.00, 'First delivery'),
(2, 1, 2, 'DR002', 'Cement', '2026-03-18', 25000.00, 25000.00, 0.00, 'bags', 200.00, 'Full payment'),
(3, 1, NULL, 'DR003', 'Cement', '2026-03-22', 25000.00, 1000.00, 24000.00, 'kg', 10.00, 'good'),
(4, 1, 1, 'DR003', 'Steel', '2026-01-15', 30000.00, 20000.00, 10000.00, 'kg', 50.00, 'January delivery'),
(5, 1, 2, 'DR004', 'Cement', '2026-02-10', 15000.00, 15000.00, 0.00, 'bags', 100.00, 'February delivery'),
(6, 2, NULL, 'DR010', 'Bricks', '2026-02-10', 40000.00, 30000.00, 10000.00, 'nos', 500.00, 'First batch'),
(7, 2, NULL, 'DR011', 'Sand', '2026-02-15', 18000.00, 18000.00, 0.00, 'tons', 20.00, 'Full payment'),
(8, 2, NULL, 'DR012', 'Bricks', '2026-03-05', 35000.00, 20000.00, 15000.00, 'nos', 400.00, 'Second batch'),
(9, 3, NULL, 'DR020', 'Tiles', '2026-01-20', 60000.00, 60000.00, 0.00, 'sqft', 300.00, 'Full payment'),
(10, 3, NULL, 'DR021', 'Paint', '2026-02-05', 25000.00, 15000.00, 10000.00, 'ltrs', 100.00, 'Partial payment'),
(11, 3, NULL, 'DR022', 'Tiles', '2026-03-01', 45000.00, 30000.00, 15000.00, 'sqft', 200.00, 'Second batch');

-- --------------------------------------------------------

--
-- Table structure for table `Drawing`
--

CREATE TABLE `Drawing` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `particulars` text,
  `file_url` mediumtext,
  `status` varchar(50) DEFAULT 'Submitted',
  `uploaded_by` varchar(255) DEFAULT NULL,
  `approved_by` varchar(255) DEFAULT NULL,
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Drawing`
--

INSERT INTO `Drawing` (`id`, `project_id`, `particulars`, `file_url`, `status`, `uploaded_by`, `approved_by`, `remarks`) VALUES
(1, 1, 'Basic Plan', NULL, 'Approved', NULL, NULL, NULL),
(2, 1, 'Plinth Beam Plan', NULL, 'Approved', NULL, NULL, NULL),
(3, 1, 'Site Diagram', NULL, 'Rejected', NULL, NULL, NULL),
(4, 1, 'Blue Print', NULL, 'Submitted', NULL, NULL, NULL),
(5, 1, 'sasa', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/4QAuRXhpZgAATU0AKgAAAAgAAkAAAAMAAAABABoAAEABAAEAAAABAAAAAAAAAAD/2wBDAAoHBwkHBgoJCAkLCwoMDxkQDw4ODx4WFxIZJCAmJSMgIyIoLTkwKCo2KyIjMkQyNjs9QEBAJjBGS0U+Sjk/QD3/2wBDAQsLCw8NDx0QEB09KSMpPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT3/wAARCAC0AN8DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2WiiigAooooAKKKKACiiigAooooAKKKhe6t42w88Sn0LgUm0gJqKqNqdmOs6fgaT+1bP/AJ7D8jU+0j3HyvsXKKqjUrVukw/I08Xlu3SZPzoU4vZhZk9FIGB6EH6GlqxBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUVBPdx2/DHLeg61LkorUaV9ieoJ7yC2/1siqfTufwrLnvbifKqfLQ/3Tz+dVHhWNHlkOFUFmY9gK5Z4tLSKuaKn3L02ujpbwlvdjgVTk1O+mz+8EYPZBVIajaS6JcanZutxDDG7cHGSozjnp/9epNBuG1jTBM8YhmVnikQHPluDj+WD+Nc8qtSSu3YtKC6AySy58yR3/3mJFCWo44GPameGxLqfh0JdMXuFMltOx7srFc/iMH8ak8IqZvCtgX+/GhiYn1Riv8ASs2nq2Vz9hkktrCZlmmRDbxiWUHjYh7n2ODVqGFZo0kjyUdQykjGQfrXO+Ibdx4uklWP7Rbw2sNxcWyjmZFdvz2k7tvfGK7C3vbW6to7i3kWWKVQyuOQQaJRsk11EptsybnUdPsLnyLq4EcoUOV2M2FPGTgcDg9fStG3ijuIUlgZJIpBuVkOQw9q5vULuQeLdSa31S2sCtlCpaaMNu5c9yMY/Grmg6lDZ+DLWWFGijitmYKxyeMkn8eT+NNwSSFds27cQy5MEsb46lGBx+VW0Lx/8tD+JzXmujo8T+H4ntoLWXBuDcxNl5xjJRsAYzvHXPSuo1XXRp1qZMGSVjsiiHWRz0H9foKbUotKLBJtanTC7A+9g/SnLeQnq2368VxWi61dXVg5vzH9pimeJzGMKdpxxUkmtwC8+yecvnld4TuRWka9SLs9Q9kmrncBgwyCCPalriV1SSF90cjKfY1ftfFgQhbtNy/30HP4j/CuiGKi/i0JdGS21Onoqva3sF9H5lvKsi98Hp9fSrFdKaaujJqwUUUUxBRRRQAUUUUAFIWAGTwBTZJFiUsxwKz5tQDegHasKtZU15lRi2WJp3bKx5A/vVW+z5PPU9yahe+HrUD3/vXnTqSm9WbKNloM03WtO1K8ubW3lbz7dirI67ScHBIz1APGRWifJ2kNgqRgg968+ktZ77WNQtoZY7b7Pd/ao7kAmVC6g4XtgkHOc5z0710NtfXItYxfNEbgDDGLO0+/Pr6U5RS1TGk2c/8AY7my0nVbfTo2lkiMllcQDrJGRmKQf7QVgPcD2rp9Ojk07VL+Rdn2W6WOQKDysoXa3HoQAfrU9vY3lz8wjESt1Zxgn+taUOixLzNI8h9OgrZU6lRaKyJfKupkWKJps148crFbq4NwVI4QkAHHscZ/GobXRLSC5+0WtlKZPMaVWLOwVm5JAJwM5PSuritoYf8AVxKvuBT3dIxl2VR6k4rRYXrJk+07IwTaXTy+aLX95jbuOM464z6Z5xTBp16qhY7ZUUdACoArbN9bD/l4i/76FL9utz/y2T86fsKXVhzy7HNXOi3E77ptPilYfxMEY/rVe6sbx4XhmspGidSrKF3Aj04rrhdQHpKv51IHVvusp+ho+r03sx+1kuh5zNGkV1DI8Txy26GONSCu1T7fgKoXlml/eLPcPKwjXESqxXyz3YEdz0r1VkVwQyhgexFUptE0+flrZFPqg2/yqXhZLWLLVaL3R5rpkM9lHcI5Yq07SKzHcSp9fesvzWhkh1a4ypmaVxkYwgTCj8QP1r02bwugybeY+yuP61k3/hpJ1jS9t9yxuJFIPGR06fyNZOM4NuS0KU4tWTOesbZ7XTBLeSMG2maVmOdueT+XT8KXT7pLzylkglt5Jl3xLIP9YvqD64wcda0tf064mht41hkkszKGuhEMuUHIAXuCeuOcClsrZta1hLwRSR2NmpWHzEKGSRhgtg9gOPqaiys2yudp2RPaxy2swlt3aNx3Hf8AxFdPp2rC4xHcgJL2I6N/hVFLP2qZLP2op1pU35diJ2kbtFU7R3QBJCSB0Jq5XpU6iqK6OZqzCiiitBBUNzcx2kDSythRU1YOvaVfXxV7aVWRR/qjwc+ue/44qKjai3FXZUUm7NlG71dp5CxOB2GelUnv/f8AWqM9pdwPsnjaM9tw4NRi3Y9Sa8mTk23Lc7oxiloXXv8A/aqB74noTTRae351vaR4bEm2e8BCdVj6Fvr7e1OnTc3ZClKMFdmbp2n3eqSFoUEcZPzSsOD/AIkV1Vho1tYAMq+ZKP8Alo/J/D0/CrM08FjAC2ERRhVUfyFczq+vv5TO0otbcd84J/H+grtjCFKy3ZzOUp+SN6+1mzsMiWTc4/gQbj/9b8awLvxlNz9ngSJB/FIcn/AfrXGXWuNIStnGFXp5ko6/Rf8AGsyUvMd07tK3+0eB+FehSwGJrayaivxPPr5jhqGi95/gdVc+MGcnffSSHusIP9OKoN4o5JjtXY5+9I4XP86xBxx29qStKmDwdD+NNt9rjw1TMMdrhqaS7s2f+Epvd3y29uo7ZJNH/CWamOgth/2zJ/rWIJFZioYZHUU/8KunHL7qPLZvuFbBZvGLnFqSW/K1obkfjLU4+sdq/ttI/rVuHx3dJ/rrGFv9yUr/ADFcxxSV2vLcLJfCvkeJ/aeLi7N7eR3tr8QbMkC4gu4PcAOB+X+FdBp/iXT9RIW2vIZH/ultrfkea8iprKGxkA46ZrnnlEN6cmvyOinnM/8Al5G57mJl75FSHkdiK8d03xJqulYEF08kQ/5ZTHev4Z5H4V2WjeOLK/dYrr/QrhuBvOY2Ps3Y+xx+NcFbC4ihrJcy7o9KhjaNbSLszqZLOJm3AbT7VBIiRHDDn3703UdU+wafNceWXaNdwAPBrkZNU1ue9MVzeWkD79gjABAO3dg/xYxxu9e1ebWVOSvHc74JnW+ag6AUw3QHpWLbaiLmzSUNnIw3GMMOCPqKV7r3rkaaNlE1Tee9T2uorvEcjcHoxrnjee9WbaxvbvBWMoh/ifj/APXWtFzUvdVxShG2p1VFQWsTwW6xySeYyjG7GKnr1U3bU5QooopgMeNJUKyIrKexGazp9BtZMmIeU3tyPyrUoqJU4yWqGm1sZNnoqwz75trBeVAq/dXAt4i2Mseg9amJABPpXPa9qa6faPcuu+QnZFHn7zHoPp3PsKya5LQprVlc1/ek9EZWu6ytmdznzrqQfu4gcY9z6AfrXHXLz3s3nXT+ZJ2GPlX6Dt/OrjxySyPNO5kmkOXc9/8AADpik8qvbwWDhQXNLWT3Z4GNxs675IaRM/yTSi3JOMVf8mp7e1yhbHU1WY436rQdTrsicrwCxWJjCW27M77L7VHLGkIDSMqAnAZug/LtW39m9qr3WkxXqKsm75TkYOK+Kp4uM6qlWbs3qfpU5OnQdPDpJpWSMZ4Y9EuZJLp4bi92/uoo/mRdw4dmPB4OQBntnFZYmlH/AC0b866uTRoJSDIrOyxrGCT0AGB+OK5vUbCTTrkxsCUYZRuxH+Ir6rB4/C4uXs1ul1PksRh8ThVz30e9mTWOsNYQyBba3nmZhiW4TftX0CnjnrmrsniuWbT5baTTtO3yDaJUgCMn0x396whjI3Ehc8kc4q5q2l3Gj3rW1ypHG5G7OvYivScKd0up5rbd2/mVRNKP42p6XUgdS3zKDkr0zUNdR4Y8Oprehau4i33SBRbEnHzDJ4+vAq6lRU1d7ERoxm9kYt/fRTXReyga2hIGInffg9+ferYi3xjI4YZIPNZMtvLDMYpo2jlBwUcbSK6X7M0fyMPmX5Tj2qoyVrXOPFU0rOKsPtdVnt7JrC6MlxYMMbAfni90J6gf3T+lbGnW91cFb2x02KWSU5+0Fx5brtA5HUEEZx2OR0rE8j2rR0PVX0O8LMT9ikP79f7v+2Pcd/UV5OYYCM06lJWfVHbgMdKLVOo7rozu9O0oRaFHZXO1mIJdlGPmJySPfJrOh8MztM3nXCrGDwUGSw/p+tb1vMH4yCD0I6GrFeXCEKsU2tj2eeUb26lG00m0s8GOLc4/jbk//W/Cr1FFbxiktEQ22FFFFUIKKKKACiiigCGdwAF9a4XX5vt2tyKDmK0HlqPVzyx/LA/OuxupP9Kx6AVwUN1Ewmkkba7zyMQR1y56eoqcG4vESnLpsYYy/srLqN8ijyKmFxGULbWJDbQo5J/wp/mRZAz1fYfY/wCHHWvYVeD6njujLsVvIrQtbfMCn61CTEMfOpyCQAc5x1/LB/Krdpe20aBHf73zAgZ4/wD18Yrw+IXKeE9zVp3PTyiXsa931Vg+ze1H2b2q9LNbQqS0i5BIKjk8HB/InFOLwC4MJdRIMYz3zxx754r4L2k97M+n+sruZ/2b2qlqmirqVm0Rwsg5jYjof8DWy11aJJHGZVzJgqR0Oeh+hxj/AAqQSW5O0SLnf5Yz3bGcfXFa0sTWozVSCaa1IqVY1IuEtUziv+EPkk8PwXCxiK6iuDHdF3yuw9GA9BkdOa6PVZ49W0d9O1eBYbhJmRJLYbxGEI+YZ55Bxj0q8biDzvsvmqRI4cgHjhSOT9cD6isaRVjk81pGaOdTKjOMYwduP/HAfxr7rA5j9aaVTR2vfzPBxFL2UW4a6mafB2kkoRrU2z+NTancfp2rvdHbTJtOW3tkxDaqE/eDBUY6/wD1648XMJQFiUbbuKkZ/l1/Cp7W9itrkySCRSnSIcGU9QD7d+fSvRrSjON3O/Y5KNSSlrGy6lvxJ4Zi1a5e9inBurRVLA8iVOoyfXGee/FYsaLKN6sGU9GBzmr8V65jvGQ4lu7eXeVwQhxn9PQVVsora1tooIW+QJuDHj8/Q960oVFFWbvYzxKU0mluM8ijyQeCMg8EHvVp3iTOWHygE45xmk8yLzvKz83sM1u60erONUX0RseF71jYNayMTJaNsBPdDyv5Dj8K62NhJGGHcVwOjyqmszqjgq1ujEA/7Rx+hrtdMk8y1/3WI/r/AFrwZWhiZRjs9T6Ck3KjGT3LlFFFbDCiiigAooooAKKKKAMrUcx3QbsVrjYY4Yp7uF1G6K4bAOTgE7l/9C/Su51SAy229fvJz+FcxK4s9SjuTxDcAQynP3W/gb6HO38RXFKkpVXBtpPqOouaF1uij5VrsK7F2k5Iwef85NHl22ANi/d25wenSuj8pvek8o1r/ZsdudnHzPsc4YbUgrt+UnnqP8in4g6hQCDncARg/X14Fa+o3I03T7i7kBKxIWxnr7fia8tutY1G/na4e5nyDkBGIVPy6CtYZP7Vazdhc7XQ7ny7YYwMbRgcH6UpS3OM5ODnkk/59frzUPg3W5dUtpre7fdNbgMJCcbk9/cevvV4+KdFSfyTfLuzjcASv51m8lim1fYftZEGLcdh1yAQTj6enekxbjPYE5KjOPStySSGKAzyTIkIG4yFsLj6+9VLLV9O1KYxWl5HLKBnaCQT+fX8Kj+yINfF+Ae1kZvl23dQxzuJIJyen+NKUtjnKqeNvIJ49PpWnfalYaa6reXaRM3IUnJP4DtXD2up6pc6/PbQX8vJmEau/wAowrEfyrWnk6d7SaQvaPqdJ5dtgjYoz6Ajvn+ZP50eXbYIKg5JOSCTzx1/E1X8GxamEuzqMzNGMbQ8ocg9zx0FbMes6ZJc/Z0v4DLnAUP1/wDr0PKUm4qbYvaPsZxjtSANi4XpgEYz/jijy7Xn5F+YgnjGcc/1NUfFMWsf2xb/AGGdki2jaBKF2tnnOeorrUibYu45bAyR3NDypRSfO9Q532OfEVsNvH3cY69v60rx2rgKVXHTgEfy+p/Oug8o1WvZ0sLOS4mztQcKP4j0AHuTxU/2ar3c2Ck3okY1h5f9q3UkIAVI0j4GMkksfyyPzrt9HH/EvVv7xJ/p/SuJ0yKWV1iPzXE7lnxz8x5P4Dp9BXoEUawxJGv3UUAVlQj77ad0tLnpSXJBRe5JRRRXYZBRRRQAUUVTvNTtrHiV/nxkIoyT/n3pNpK7Gk2XKjmuIreMvNIkaDuxwK5268R3EuVtY1iX+83zN/gP1rHkSS5ffNI0j+rHOK5Z4qK+HU1jRb30Ovs9VtNQkeKCQsyjoRjcPbPUVl6rp4hLhkD28oIKkcc9jWPb5huQ0MgWaPDYB5A/wPIrrLO7j1G3KSqu7Hzoen4e1TGarKz0fQco8jutUYOmXptZI7G9fKsdtvcMfv8A+w3ow9e4962vJ9qztS0fYjjZ51swwykZI+v+NVbLU7rTAI5N95ZjgEczRj/2cfr9a6KeIa92pozGdFPWInjWPZ4Svjjsv/oQrhfDahtD8QnHS1Xrz3Nd9q99pfiPRLmygvtnm4BYRMSmDnkevHesTTPDthptjqVt/arSfbYhGG+zMNmCTn3rvp4qlCm4ylZ3Ryypu5w9lNLDZX/klhviVHI7KWH8+n40+KxtJNCmuxd4vIpADb4/gOBuz9TXaaL4a0nTXuhd6gbuG4h8pk8hlxznOfXiq/8AwhulxrcJFrMwSVQoDWxJXDA/j0xW/wBfoXfvW/Uz9mzmLy/nl8K2FqzsYkmkGCeoG3A+g3Gi+sjol7pstvM5klgiuQx/hJ7fTiull8HWEllDbDWmHlO77jatzux/LbVjVPDVhqb2TDVmi+zW8cBH2Zju29/bNL67h00lJW1uHs2co/l6p4ql/tS6+ypJK2+VhnbjoPpwBS2GLjXrt4cvH5Vw4bHVdjYP6iuw13w1our3P2qG+ktZ2A8wiEsr4747GpdJ0HRdK0+7iS8llubmIwtO8J4B9BjpSePocuktdrdh+zdzidMuJLbwvqxhYoZHhjYjjg7v54qCXTFi8PW2oiRt8s7xFMYA2jOR711sXhOxi0u5sv7YY+e8b7vszDbtz2981JL4asJdAt9M/tZh5MzTeZ9mbncMYx7U/r1BO6kt/wBBezZyuuXD3iaRNOd8htFBY85xIw/pXrwh4HHauGufCVjcw2Sf2wy/ZYvLyLVju+Zmz7fex+FdbN4l0+LMVsXurhR/qo0OR9SeFH1rGriac0uVrS5pCm2yzcGK1gee4dY4kGWZjgCuP1G9k1S5EpVo7eI5gjPBP+23uew7fWrtwLvVrlHvMOwOYreMHZGf/Zj/ALR/ACt7SfD62zrc3YDS9VTqE9z6n+VefUrSq3hDbqzsp0o0velv0Q3w1o7WkZurpcTOPlU/wL/jW4Jo2YqGBYds1lahrKDMMDZPQsP6VjG/V87XVsHBwc4rB1lStGCuluackpu7OyorkYtdng4WTco7PzWlb+KLV8LcK0R/vD5h/jWsMTCXkQ6Ml0Nyio4Z4riMSQyLIh6MpyKkro3MwrO1TTVvY9ygCVeh9fatGiplFSVmNNp3RyX2UoSCuCOCD2okjjt4XmndY4kG5mY4AFdJc2izfMBh/WqclkkiGOaNWRvvK4yDXl1aTpvyOhVLo5C3sLnW7pNTV3sooxi0Gz55Af4nB/hPZffPWti01G0m1KW1trgfaoDhlH64PQ46HGcVb1eK8NqkGm4WWdtjzkj9wnd8dz2A9TWF4f03z5IfLuQ+l6ZcsbRxGFe4bGCzN3AJIzgbsZo3V72tsLmex2ltc+YAsnDevrUF3o8NwS8f7qQ9wOD+FZFv4hgktry9mCxafFJshlJOZQOC2PQtwMda1RqJXpgjrzW0aya5aiv5kcrTvEwdQ0El/MmhYSAYE8Jww/Ef14rPNtfQ/wCreK6Qdn/dv+Y+U/pXaR6pA/DnYffpTns7S6G7YjZ/iU/4VToxmvdd12YpWfxI4c3oi/4+oJ7f1Lx5X/voZFPiureb/UzxP24cGurbRQDmKZh7MM1UuPDiTH99b2s2OhZAT/KueWD8mvQzdKL2Zi8+lHNaB8KWoyBY7PeKQr/I0Dwpbf8APK7/APAqT/4qsnhH5i9k+6M/mkJCDLEAdyeK1U8JWfUw3J9c3Uhz/wCPVZi8LaahDf2dblvWQb/55prCN9xeyfdHMvf2qHb56M/91DuP5CpYxe3H/HvYS4PR5/3Q/X5v0rs4tPigQLCkcSjjbGoX+VSC0j7jd9TW0MF5feNQijj49DuLggXlyzZ6xW4KA/VvvH9K1bPw+I4giRrBGD0UYJ/+v7mtae+s7BcSyoh/ujk/kKxL7xPK/wAljFsz/wAtJBz+A/x/KteSEF7z+SNoJ7RXzNcmx0aAu7LGDxub7zf4/hXOap4le8zHbgxwnqP4m+vt7Vjalcsn+kXbSzOzBFHVmYnAAqm8R1e2uLQCWzu4iCVLYI7g5HVT04qZVXJWirI2jTSd5asluL1ryO6tIJGjmCYyRjbkdfp9KyxLdaVC7rZ2EIUAyJHIQz9sjjqfxp4t9QkjW5tk8+5tG2PExCyr6o3Z1PUHg9DzXRf2VBNJFcTWqecoyCwBK+2fasnaG+qKvfYqBJHAOTyM4q3YaVNqF0IkJA6sx/hFaVrpb3UgRB9WPaunsrKKxh8uIdfvMerGro0XN3ewqlblVluOs7SKytkghXaiDj396noor0kraHG3cKKKKYBUU8PmocHa3Y1LRUyipKzGnY5+6kkt3KSKR6H1rJ1J3k0e4tLFlhdoikePlC5/lnn867Ce3juYjHMgZT61zep+H7mHMlkTNH1KE/MP8f5/WuCph5Rd46o3hNPR6GBE8l7NaRvaNaWNiAVhcg75BwOn8K9fc81W1G+nutTKw3rokluTaNFJhDKDzu9e3B9DU7GYOUZGV1PKsMEVQi0jy5oWEshihYvFCcYVj79e56+tZcyvqbcnY0r3W5LG2jlki83osnlnBDHA4B65NPj1oLGJhI9uM4O87CDWZdWctze2cW1jChMztjjI+6PzOfwpmq2sk15ZWsMSSuzGZkc4BVR3/FhSST9Qdlc6OLxRex42yrKvYMMg/iKtxeMph/rLNX/3WK/41yt7bNY6G5ghW2lkKqqoc7XZgOKsWdvLDq81k0zzxLAsgaQDcpLEYyOoOM81aqTS0ZLjBvY62PxfCf8AWWkyn/ZINTjxVZn/AJY3H/fI/wAa4/UpJLWe0hjeCI3DOC833RtXPqOpwKfb3FzcaHLeQ26STRFwFBJWQK2Mr7EAkVar1bJ6EOnC9jrv+Ente0M5/Af40xvEy/8ALO1c/wC8wH+Nc9ptwupXMptlVrRI0Ik7s7Ddj8FI/E1Dqt7Npmq2abUNm6M0xIywAYDIPoNwNHt6l7X1Dkgjfk8Q3j/6uKJB7gsao3N/dyRM9xdMsajc2DtAHvjtWfby3J8XSWzSE2hVo0THAkRUYn64arem2udV1mwmyyFklVWOfkdMEfTKms5TqPdguVbIaLfMJkjHmEruXB+93/Wm2Ij1PTY50DIk6cjPKnoR9Qcj8Kf4euraOyg065uYxfQSNa+UW+dthIBx6FQDk1PZ6bqen6hdW9pawtYyzCdJZJdojDffUKOSc5PYc1Dja/cpzMizsZNT0q4024kK31m+zzD1DDmOT8Rg/nT7W2vL3VrGeSwmtpbdHju3cAIwI4Cn+IFuR6CurTSbdL9rwKRM8YjY54Kg5GR6j1q5Hahug49aabbtFXuQ5dzGj02ITtOI1ErqFZgMEgdPyya0LfSy5BcbU/nWlHbonOMn3qauqnhes/uIdR9BkUSQIEjUACn0UV2JJKyMgooopgFFFFABRRRQAUUUUAV7mwt7wYnhV/cjkfjWTP4ZTJNvKR/svz+tb1FZzpQnuilOS2ZyraPPF96JiPUc/wAqp3Oh2164a4hzIgwrglWX8RXbUxo0f7yA/UVzPCW1izT2ze5x1/ojX1tFFHM0LRSJIrFd+SvTOevPP4U/TtFktpri4uZxcXM5Xc4TYAq9FA9Bkn8a6o2kJOduPpR9kQdM1m8NUSstQ9om7nIarpFzNqFlcQWUF5FCkivFLIFyW24PIPTB/Or2g6TNY6akV0EEnmM4RDlYwWJCA9wAQK6D7MezD8qT7O/Zh+VT7Kra1g51e9zn/D2ivpumvBNGqMbiVwFOflZyR+mKm1HRRe3tlKdjRReakyt/FG6YwPfIFbBtZD/y0H5Un2Fu8v5Cj2NW97BzK25zumeGxYJZGW7Ms1tcSTF9v+sVl2BT7gbefatUWtvHqT3yhvPaIQnngqDkceuSfzq+LBP4nY08WkI/gB+vNX9XqSd20hcyRQjSJJHkhgQSSHLMiAFvqR1qysMsnX5R71cCgcAAD2FLWscKl8TuS59iFLZU5OWPvU1FFdMYKKskS22FFFFUIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==', 'Rejected', NULL, NULL, NULL),
(6, 2, 'Floor Plan', NULL, 'Approved', NULL, NULL, NULL),
(7, 2, 'Elevation View', NULL, 'Submitted', NULL, NULL, NULL),
(8, 3, 'Site Layout', NULL, 'Approved', NULL, NULL, NULL),
(9, 3, 'Structural Plan', 'data:image/jpeg;base64,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', 'Rejected', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `LabourBill`
--

CREATE TABLE `LabourBill` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `bar_bender` varchar(255) DEFAULT NULL,
  `head_mason` int DEFAULT NULL,
  `mason` int DEFAULT NULL,
  `m_helper` int DEFAULT NULL,
  `w_helper` int DEFAULT NULL,
  `total` int DEFAULT NULL,
  `extra_payment` decimal(15,2) DEFAULT NULL,
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `LabourBill`
--

INSERT INTO `LabourBill` (`id`, `project_id`, `date`, `bar_bender`, `head_mason`, `mason`, `m_helper`, `w_helper`, `total`, `extra_payment`, `remarks`) VALUES
(1, 1, '2026-03-17', 'General Work', 2, 3, 4, 2, 11, 0.00, 'Week 1'),
(2, 1, '2026-03-18', 'Column Work', 1, 2, 3, 1, 7, 500.00, 'Week 2');

-- --------------------------------------------------------

--
-- Table structure for table `LabourPayment`
--

CREATE TABLE `LabourPayment` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `particulars` text,
  `date` date DEFAULT NULL,
  `net_amount` decimal(15,2) DEFAULT NULL,
  `extra` decimal(15,2) DEFAULT NULL,
  `labour_amount` decimal(15,2) DEFAULT NULL,
  `cumulative_amount` decimal(15,2) DEFAULT NULL,
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `LabourPayment`
--

INSERT INTO `LabourPayment` (`id`, `project_id`, `particulars`, `date`, `net_amount`, `extra`, `labour_amount`, `cumulative_amount`, `remarks`) VALUES
(1, 1, 'Week 1', '2026-03-17', 5000.00, 0.00, 5000.00, 5000.00, NULL),
(2, 1, 'Week 2', '2026-03-18', 7000.00, 500.00, 7500.00, 12500.00, NULL),
(3, 2, 'Week 1', '2026-02-10', 4500.00, 0.00, 4500.00, 4500.00, NULL),
(4, 2, 'Week 2', '2026-03-05', 7000.00, 500.00, 7500.00, 12000.00, NULL),
(5, 3, 'Week 1', '2026-01-20', 4000.00, 0.00, 4000.00, 4000.00, NULL),
(6, 3, 'Week 2', '2026-02-05', 5000.00, 300.00, 5300.00, 9300.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Material`
--

CREATE TABLE `Material` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `particulars` text,
  `unit` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Material`
--

INSERT INTO `Material` (`id`, `project_id`, `particulars`, `unit`) VALUES
(1, 1, 'Steel', 'kg'),
(2, 1, 'Cement', 'bags'),
(3, 2, 'Bricks', 'nos'),
(4, 2, 'Sand', 'tons'),
(5, 3, 'Tiles', 'sqft'),
(6, 3, 'Paint', 'ltrs');

-- --------------------------------------------------------

--
-- Table structure for table `MaterialTrackingEntry`
--

CREATE TABLE `MaterialTrackingEntry` (
  `id` int NOT NULL,
  `material_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `received_quantity` decimal(15,2) DEFAULT NULL,
  `consumed_quantity` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `MaterialTrackingEntry`
--

INSERT INTO `MaterialTrackingEntry` (`id`, `material_id`, `date`, `received_quantity`, `consumed_quantity`) VALUES
(1, 1, '2026-03-17', 100.00, 40.00),
(2, 1, '2026-03-18', 50.00, 10.00),
(3, 2, '2026-03-17', 200.00, 80.00),
(4, 3, '2026-02-10', 500.00, 100.00),
(5, 4, '2026-02-15', 20.00, 5.00),
(6, 5, '2026-01-20', 300.00, 80.00),
(7, 6, '2026-02-05', 100.00, 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `Payment`
--

CREATE TABLE `Payment` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `particulars` text,
  `date` date DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `paid_through` varchar(255) DEFAULT NULL,
  `remarks` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Payment`
--

INSERT INTO `Payment` (`id`, `project_id`, `particulars`, `date`, `amount`, `paid_through`, `remarks`) VALUES
(1, 1, 'Installment 1', '2026-03-17', 200000.00, 'Cash', 'First installment'),
(2, 1, 'Installment 2', '2026-03-18', 150000.00, 'Bank Transfer', 'Second installment'),
(3, 2, 'Installment 1', '2026-02-10', 300000.00, 'Bank Transfer', 'First installment'),
(4, 2, 'Installment 2', '2026-03-05', 200000.00, 'Cash', 'Second installment'),
(5, 3, 'Installment 1', '2026-01-20', 500000.00, 'Cheque', 'First installment'),
(6, 3, 'Installment 2', '2026-02-05', 400000.00, 'Bank Transfer', 'Second installment');

-- --------------------------------------------------------

--
-- Table structure for table `Payment_plan`
--

CREATE TABLE `Payment_plan` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `particulars` text,
  `date` date DEFAULT NULL,
  `amount` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Payment_plan`
--

INSERT INTO `Payment_plan` (`id`, `project_id`, `particulars`, `date`, `amount`) VALUES
(1, 1, 'Phase 1', '2026-03-20', 300000.00),
(2, 1, 'Phase 2', '2026-04-20', 500000.00),
(3, 2, 'Phase 1', '2026-03-15', 400000.00),
(4, 2, 'Phase 2', '2026-05-15', 600000.00),
(5, 3, 'Phase 1', '2026-02-01', 500000.00),
(6, 3, 'Phase 2', '2026-04-01', 700000.00);

-- --------------------------------------------------------

--
-- Table structure for table `Project`
--

CREATE TABLE `Project` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `client_id` varchar(255) DEFAULT NULL,
  `labour_contractor` varchar(255) DEFAULT NULL,
  `address` text,
  `total_budget` decimal(15,2) DEFAULT NULL,
  `status` enum('Active','Completed','On Hold') DEFAULT 'Active',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `budget_spent` decimal(15,2) DEFAULT '0.00',
  `completion_percentage` decimal(5,2) DEFAULT '0.00',
  `created_by` varchar(255) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  `admin_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Project`
--

INSERT INTO `Project` (`id`, `name`, `client_id`, `labour_contractor`, `address`, `total_budget`, `status`, `start_date`, `end_date`, `budget_spent`, `completion_percentage`, `created_by`, `created_on`, `updated_by`, `updated_on`, `admin_id`) VALUES
(1, 'Residential Complex', 'admin-001', 'Suresh Construction', 'Whitefield, Bangalore', 1500000.00, 'Active', '2025-01-01', '2025-06-30', 975000.00, 65.00, 'admin-001', '2026-03-22 15:27:29', 'admin-001', '2026-03-22 15:27:29', 'admin-001'),
(2, 'Commercial Tower', 'admin-001', 'Ramesh Builders', 'Electronic City, Bangalore', 1800000.00, 'Active', '2024-12-15', '2025-08-15', 720000.00, 40.00, 'admin-001', '2026-03-22 15:27:29', 'admin-001', '2026-03-22 15:27:29', 'admin-001'),
(3, 'Hospital Building', 'admin-001', 'Krishna Constructions', 'Hosur Road, Bangalore', 1700000.00, 'Completed', '2024-10-15', '2024-12-15', 1700000.00, 100.00, 'admin-001', '2026-03-22 15:27:29', 'admin-001', '2026-03-22 15:27:29', 'admin-001');

-- --------------------------------------------------------

--
-- Table structure for table `ProjectSupervisor`
--

CREATE TABLE `ProjectSupervisor` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `supervisor_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `RateList`
--

CREATE TABLE `RateList` (
  `id` int NOT NULL,
  `project_id` int DEFAULT NULL,
  `head_mason_rate` decimal(15,2) DEFAULT NULL,
  `mason_rate` decimal(15,2) DEFAULT NULL,
  `m_helper_rate` decimal(15,2) DEFAULT NULL,
  `w_helper_rate` decimal(15,2) DEFAULT NULL,
  `column_barbending_rate` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `RateList`
--

INSERT INTO `RateList` (`id`, `project_id`, `head_mason_rate`, `mason_rate`, `m_helper_rate`, `w_helper_rate`, `column_barbending_rate`) VALUES
(1, 1, 800.00, 800.00, 600.00, 400.00, 500.00),
(2, 2, 800.00, 800.00, 600.00, 400.00, 500.00),
(3, 3, 800.00, 800.00, 600.00, 400.00, 500.00);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `username`, `password`) VALUES
('admin-001', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Client`
--
ALTER TABLE `Client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `DailyReport`
--
ALTER TABLE `DailyReport`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indexes for table `Drawing`
--
ALTER TABLE `Drawing`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `LabourBill`
--
ALTER TABLE `LabourBill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `LabourPayment`
--
ALTER TABLE `LabourPayment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `Material`
--
ALTER TABLE `Material`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `MaterialTrackingEntry`
--
ALTER TABLE `MaterialTrackingEntry`
  ADD PRIMARY KEY (`id`),
  ADD KEY `material_id` (`material_id`);

--
-- Indexes for table `Payment`
--
ALTER TABLE `Payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `Payment_plan`
--
ALTER TABLE `Payment_plan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `Project`
--
ALTER TABLE `Project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ProjectSupervisor`
--
ALTER TABLE `ProjectSupervisor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `RateList`
--
ALTER TABLE `RateList`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Client`
--
ALTER TABLE `Client`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `DailyReport`
--
ALTER TABLE `DailyReport`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Drawing`
--
ALTER TABLE `Drawing`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `LabourBill`
--
ALTER TABLE `LabourBill`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `LabourPayment`
--
ALTER TABLE `LabourPayment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Material`
--
ALTER TABLE `Material`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `MaterialTrackingEntry`
--
ALTER TABLE `MaterialTrackingEntry`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Payment`
--
ALTER TABLE `Payment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Payment_plan`
--
ALTER TABLE `Payment_plan`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `Project`
--
ALTER TABLE `Project`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ProjectSupervisor`
--
ALTER TABLE `ProjectSupervisor`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `RateList`
--
ALTER TABLE `RateList`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `DailyReport`
--
ALTER TABLE `DailyReport`
  ADD CONSTRAINT `DailyReport_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`),
  ADD CONSTRAINT `DailyReport_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `Material` (`id`);

--
-- Constraints for table `Drawing`
--
ALTER TABLE `Drawing`
  ADD CONSTRAINT `Drawing_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);

--
-- Constraints for table `LabourBill`
--
ALTER TABLE `LabourBill`
  ADD CONSTRAINT `LabourBill_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);

--
-- Constraints for table `LabourPayment`
--
ALTER TABLE `LabourPayment`
  ADD CONSTRAINT `LabourPayment_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);

--
-- Constraints for table `Material`
--
ALTER TABLE `Material`
  ADD CONSTRAINT `Material_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);

--
-- Constraints for table `MaterialTrackingEntry`
--
ALTER TABLE `MaterialTrackingEntry`
  ADD CONSTRAINT `MaterialTrackingEntry_ibfk_1` FOREIGN KEY (`material_id`) REFERENCES `Material` (`id`);

--
-- Constraints for table `Payment`
--
ALTER TABLE `Payment`
  ADD CONSTRAINT `Payment_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);

--
-- Constraints for table `Payment_plan`
--
ALTER TABLE `Payment_plan`
  ADD CONSTRAINT `Payment_plan_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);

--
-- Constraints for table `ProjectSupervisor`
--
ALTER TABLE `ProjectSupervisor`
  ADD CONSTRAINT `ProjectSupervisor_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);

--
-- Constraints for table `RateList`
--
ALTER TABLE `RateList`
  ADD CONSTRAINT `RateList_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `Project` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
