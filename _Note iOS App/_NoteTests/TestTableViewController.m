//
//  TestTableViewController.m
//  _Note
//
//  Created by Graeme Peters on 2014-03-21.
//  Copyright (c) 2014 Lyndon Quigley. All rights reserved.
//

#import "QUnit.h"
#import "TableViewController.h"
#import "TestTableViewController.h"

@implementation TestTableViewController

- (void)setUp
{
    [super setUp];
    // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown
{
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    [super tearDown];
}

- (void)test0Success
{
    NSError *e = nil;
    NSString* jsonString =@"{\n\"msg\":\"\",\n\"note_titles\":[\n{\n\"Title\" : \"Hey\"\n}\n], \n\"success\":\"0\" \n}";
    NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    NSLog(@"\n\n%@\n\n", e);
    TableViewController *t = [[TableViewController alloc] init];
    equal([t getTitlesFromJson:json], @"Failed to parse JSON note title data from server", @"Should equal fail msg");
}

- (void)test1Success
{
    NSError *e = nil;
    NSString* jsonString =@"{\n\"msg\":\"\",\n\"note_titles\":[\n{\n\"Title\" : \"Hey\"\n}\n], \n\"success\":\"1\" \n}";
    NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    NSLog(@"\n\n%@\n\n", e);
    TableViewController *t = [[TableViewController alloc] init];
    equal([t getTitlesFromJson:json], @"Parsed JSON note title data from server", @"Should equal fail msg");
}

- (void)testNoNoteTitles
{
    NSError *e = nil;
    NSString* jsonString =@"{\n\"msg\":\"\",\n\"note_titles\":[\n\n], \n\"success\":\"1\" \n}";
    NSData* jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary* json = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error: &e];
    NSLog(@"\n\n%@\n\n", e);
    TableViewController *t = [[TableViewController alloc] init];
    [t getTitlesFromJson:json];
    NSArray * titles= [t titles];
    equal([titles count], 0, @"Titles should exist but be empty");
}

@end
