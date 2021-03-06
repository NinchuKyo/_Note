//
//  QUnitTests.h
//  QUnit.m
//
//  Created by Kevin Malakoff on 7/23/12.
//  Copyright (c) 2012 Kevin Malakoff. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person
//  obtaining a copy of this software and associated documentation
//  files (the "Software"), to deal in the Software without
//  restriction, including without limitation the rights to use,
//  copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following
//  conditions:
//
//  The above copyright notice and this permission notice shall be
//  included in all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
//  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
//  OTHER DEALINGS IN THE SOFTWARE.
//

#import <Foundation/Foundation.h>
#import <SenTestingKit/SenTestingKit.h> // adds QUnit syntax on top of SenTestingKit

@interface QUnitTests : NSObject

+ (void)equal:(SenTestCase*)testCase actual:(id)actual expected:(id)expected expression:(NSString*)expression description:(NSString*)description filename:(NSString*)filename lineNumber:(int)lineNumber strict:(BOOL)strict;
+ (void)deepEqual:(SenTestCase*)testCase actual:(id)actual expected:(id)expected expression:(NSString*)expression description:(NSString*)description filename:(NSString*)filename lineNumber:(int)lineNumber;

+ (void)notEqual:(SenTestCase*)testCase actual:(id)actual expected:(id)expected expression:(NSString*)expression description:(NSString*)description filename:(NSString*)filename lineNumber:(int)lineNumber strict:(BOOL)strict;

+ (void)ok:(SenTestCase*)testCase result:(BOOL)result expression:(NSString*)expression description:(NSString*)description filename:(NSString*)filename lineNumber:(int)lineNumber;

+ (void)raises:(SenTestCase*)testCase callback:(void(^)())callback expectedExceptionName:(NSString*)expectedExceptionName expression:(NSString*)expression description:(NSString*)description filename:(NSString*)filename lineNumber:(int)lineNumber;

@end