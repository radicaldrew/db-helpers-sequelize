insert into service_providers (service_provider_sid, name) 
values ('3f35518f-5a0d-4c2e-90a5-2407bb3b36f0', 'SP A');

insert into webhooks(webhook_sid, url, username, password) values('6c6a4deb-a0f3-4c22-aa1b-e95a009ad540', 'http://example/com/reg', 'foo', 'bar');

insert into service_providers (service_provider_sid, name, root_domain, registration_hook_sid) 
values ('a79d3ade-e0da-4461-80f3-7c73f01e18b4', 'SP B', 'example.com','6c6a4deb-a0f3-4c22-aa1b-e95a009ad540');
insert into service_providers (service_provider_sid, name, root_domain, registration_hook_sid) 
values ('7e306626-4ee9-471b-af8d-27d9f6042fc9', 'SP C', 'drachtio.org','6c6a4deb-a0f3-4c22-aa1b-e95a009ad540');
insert into accounts (account_sid, name, service_provider_sid)
values ('ee9d7d49-b3e4-4fdb-9d66-661149f717e8', 'Account A1', '3f35518f-5a0d-4c2e-90a5-2407bb3b36f0');
insert into accounts (account_sid, name, service_provider_sid, sip_realm, registration_hook_sid)
values ('5f190a4f-b997-4f04-b56e-03c627ea547d', 'Account A2', '3f35518f-5a0d-4c2e-90a5-2407bb3b36f0', 'customerA.mycompany.com', '6c6a4deb-a0f3-4c22-aa1b-e95a009ad540');

insert into voip_carriers (voip_carrier_sid, name, e164_leading_plus) values ('287c1452-620d-4195-9f19-c9814ef90d78', 'westco', 1);
insert into voip_carriers (voip_carrier_sid, name) values ('ceafc86d-11f3-4dbd-9523-1e0f4502bfc7', 'eastco');
insert into voip_carriers (voip_carrier_sid, name) values ('64035d77-f735-4b19-9dc1-15f8cf44636c', 'southco');
insert into voip_carriers (voip_carrier_sid, name) values ('53128ee1-a5f9-4542-8129-c6b1292728ec', 'northco');

-- westco gateways
insert into sip_gateways (sip_gateway_sid, voip_carrier_sid, ipv4, inbound, outbound) 
values ('124a5339-c62c-4075-9e19-f4de70a96597', '287c1452-620d-4195-9f19-c9814ef90d78', '3.3.3.3', true, true);
insert into sip_gateways (sip_gateway_sid, voip_carrier_sid, ipv4, port, inbound, outbound) 
values ('efbc4830-57cd-4c78-a56f-d64fdf210fe8', '287c1452-620d-4195-9f19-c9814ef90d78', '3.3.3.3', 5062, false, true);

-- eastco gateways
insert into sip_gateways (sip_gateway_sid, voip_carrier_sid, ipv4, inbound, outbound) 
values ('48191aa4-fff2-4c64-b005-43414a8e94d7', 'ceafc86d-11f3-4dbd-9523-1e0f4502bfc7', '6.6.6.6', true, true);
insert into sip_gateways (sip_gateway_sid, voip_carrier_sid, ipv4, port, inbound, outbound) 
values ('ab613ca1-710c-4b42-b113-4b219eee80bb', 'ceafc86d-11f3-4dbd-9523-1e0f4502bfc7', '6.6.6.6', 5062, false, true);

-- southco gateways
insert into sip_gateways (sip_gateway_sid, voip_carrier_sid, ipv4, inbound, outbound) 
values ('bd4b8157-35c7-4c04-8e95-47b5c3effd46', '64035d77-f735-4b19-9dc1-15f8cf44636c', '9.9.9.9', true, true);
insert into sip_gateways (sip_gateway_sid, voip_carrier_sid, ipv4, port, inbound, outbound) 
values ('9637b363-6e09-4fa7-938c-7b142d0335e0', '64035d77-f735-4b19-9dc1-15f8cf44636c', '9.9.9.9', 5062, false, true);

-- northco gateways
insert into sip_gateways (sip_gateway_sid, voip_carrier_sid, ipv4, inbound, outbound) 
values ('bb49319d-7149-45ca-9343-592c60de85f0', '53128ee1-a5f9-4542-8129-c6b1292728ec', '10.10.10.10', true, true);
insert into sip_gateways (sip_gateway_sid, voip_carrier_sid, ipv4, port, inbound, outbound) 
values ('6744e360-95a1-4b10-9837-b27973e600b1', '53128ee1-a5f9-4542-8129-c6b1292728ec', '10.10.10.10', 5062, false, true);

insert into lcr_routes (lcr_route_sid, regex, priority) values ('850e14dd-a641-477f-8000-5a0573208fc2', '^44', 1);
insert into lcr_routes (lcr_route_sid, regex, priority) values ('13d952da-563a-45a5-99d5-2f4c928bfb39', '^1', 2);

insert into lcr_carrier_set_entry (lcr_carrier_set_entry_sid, lcr_route_sid, priority, voip_carrier_sid)
values ('b015ae6a-b506-454e-80c1-c68c4b43d934', '850e14dd-a641-477f-8000-5a0573208fc2', 1, '287c1452-620d-4195-9f19-c9814ef90d78');
insert into lcr_carrier_set_entry (lcr_carrier_set_entry_sid, lcr_route_sid, priority, voip_carrier_sid)
values ('850ee578-87bf-4100-aeff-391776a3e89b', '850e14dd-a641-477f-8000-5a0573208fc2', 1, 'ceafc86d-11f3-4dbd-9523-1e0f4502bfc7');
insert into lcr_carrier_set_entry (lcr_carrier_set_entry_sid, lcr_route_sid, priority, voip_carrier_sid)
values ('6f275152-0f85-4a9b-9393-f2ae07957419', '850e14dd-a641-477f-8000-5a0573208fc2', 1, '64035d77-f735-4b19-9dc1-15f8cf44636c');
insert into lcr_carrier_set_entry (lcr_carrier_set_entry_sid, lcr_route_sid, priority, voip_carrier_sid)
values ('cef59bdb-a3a4-4baf-ac8e-aac632799145', '850e14dd-a641-477f-8000-5a0573208fc2', 2, '53128ee1-a5f9-4542-8129-c6b1292728ec');
